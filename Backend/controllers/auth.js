const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const crypto = require("crypto");

const filterObj = require("../utils/filterObj");

// Model
const User = require("../models/user");
const { promisify } = require("util");

// this function will return you jwt token
const signToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET);

// Register New User
exports.register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  const filteredBody = filterObj(
    req.body,
    "firstName",
    "lastName",
    "email",
    "password"
  );

  try {
    // check if a verified user with given email exists
    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.verified) {
      // user with this email already exists and is verified, so return an error
      return res.status(400).json({
        status: "error",
        message: "Email already in use, Please login.",
      });
    } else if (existingUser) {
      // if user exists but is not verified, update the existing user
      await User.findOneAndUpdate({ email }, filteredBody, {
        new: true,
        validateModifiedOnly: true,
      });

      // generate an otp and send to email
      req.userId = existingUser._id;
      next();
    } else {
      // if user is not created before, create a new user
      const newUser = await User.create(filteredBody);

      // generate an otp and send to email
      req.userId = newUser._id;
      next();
    }

    
  } catch (error) {
    // Handle any errors
    console.error("Registration error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};


exports.sendOTP = async (req, res, next) => {
  const { userId } = req;
  const new_otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  const otp_expiry_time = Date.now() + 10 * 60 * 1000; // 10 Mins after otp is sent

  const user = await User.findByIdAndUpdate(userId, {
    otp_expiry_time: otp_expiry_time,
  });

  user.otp = new_otp.toString();

  await user.save({ new: true, validateModifiedOnly: true });

  console.log(new_otp);

  res.status(200).json({
    status: "success",
    message: "OTP Sent Successfully!",
  });
};

exports.verifyOTP = async (req, res, next) => {
  // verify otp and update user accordingly
  const { email, otp } = req.body;
  const user = await User.findOne({
    email,
    otp_expiry_time: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "Email is invalid or OTP expired",
    });
  }

  if (user.verified) {
    return res.status(400).json({
      status: "error",
      message: "Email is already verified",
    });
  }

  if (!(await user.correctOTP(otp, user.otp))) {
    res.status(400).json({
      status: "error",
      message: "OTP is incorrect",
    });

    return;
  }

  // OTP is correct

  user.verified = true;
  user.otp = undefined;
  await user.save({ new: true, validateModifiedOnly: true });

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    message: "Account created successfully",
    token,
    user_id: user._id,
  });
};

// User Login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Both email and password are required",
      });
    }

    // Find user by email
    const user = await User.findOne({ email }).select("+password");

    // Check if user exists
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Email or password is incorrect",
      });
    }

    // Check if password is correct
    const isPasswordValid = await user.correctPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: "error",
         message: "Password is incorrect",
      });
    }

    // Sign JWT token
    const token = signToken(user._id);

    // Send token and user id in response
    res.status(200).json({
      status: "success",
      message: "Logged in successfully!",
      token,
      user_id: user._id,
    });
  } catch (error) {
    // Handle any other errors
    console.error("Login error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};


// Protect
exports.protect = async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({
      message: "You are not logged in! Please log in to get access.",
    });
  }
  // 2) Verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  console.log(decoded);

  // 3) Check if user still exists

  const this_user = await User.findById(decoded.userId);
  if (!this_user) {
    return res.status(401).json({
      message: "The user belonging to this token does no longer exists.",
    });
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = this_user;
  next();
};


