const FriendRequest = require("../models/friendRequest");
const User = require("../models/user");
const filterObj = require("../utils/filterObj");

exports.updateMe = async (req, res, next) => {
  const { user } = req;
  const filtredBody = filterObj(
    req.body,
    "firstName",
    "lastName",
    "about",
    "avatar"
  );
  const updated_user = await User.findByIdAndUpdate(user._id, filtredBody, {
    new: true,
    validateModifiedOnly: true,
  });
  res.status(200).json({
    status: "success",
    data: updated_user,
    message: "Profile updated successfully!",
  });
};

exports.getUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find({
      verified: true,
    }).select("firstName lastName _id");

    const thisUser = req.user;

    const remainingUsers = allUsers.filter(
      (user) =>
        !thisUser.friends.includes(user._id.toString()) &&
        user._id.toString() !== thisUser._id.toString()
    );

    if (remainingUsers.length === 0) {
      return res.status(404).json({
        status: "error",
        data: [],
        message: "No users found",
      });
    }

    res.status(200).json({
      status: "success",
      data: remainingUsers,
      message: "Users found successfully!",
    });
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({
      status: "error",

      message: "Failed to get users",
    });
  }
};

exports.getRequests = async (req, res, next) => {
  try {
    const requests = await FriendRequest.find({ recipient: req.user._id })
      .populate("sender", "firstName lastName")
      .select("_id");

    if (requests.length === 0) {
      return res.status(404).json({
        status: "error",
        data: [],
        message: "No friend requests found",
      });
    }

    res.status(200).json({
      status: "success",
      data: requests,
      message: "Friend requests found successfully!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching friend requests.",
    });
  }
};

exports.getFriends = async (req, res, next) => {
  try {
    const thisUser = await User.findById(req.user._id).populate(
      "friends",
      "_id firstName lastName"
    );

    if (!thisUser || !thisUser.friends || thisUser.friends.length === 0) {
      return res.status(404).json({
        status: "error",
        data: [],
        message: "No friends found",
      });
    }

    res.status(200).json({
      status: "success",
      data: thisUser.friends,
      message: "Friends found successfully!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching friends.",
    });
  }
};
