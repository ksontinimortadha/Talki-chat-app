const AudioCall = require("../models/audioCall");
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
exports.getMe = async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: req.user,
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

exports.startAudioCall = async (req, res, next) => {
  const from = req.user._id;
  const to = req.body.id;

  const from_user = await User.findById(from);
  const to_user = await User.findById(to);

  // create a new call audioCall Doc and send required data to client
  const new_audio_call = await AudioCall.create({
    participants: [from, to],
    from,
    to,
    status: "Ongoing",
  });

  res.status(200).json({
    data: {
      from: to_user,
      roomID: new_audio_call._id,
      streamID: to,
      userID: from,
      userName: from,
    },
  });
};

exports.getCallLogs = async (req, res, next) => {
  const user_id = req.user._id;

  const call_logs = [];

  const audio_calls = await AudioCall.find({
    participants: { $all: [user_id] },
  }).populate("from to");
  /* 
  const video_calls = await VideoCall.find({
    participants: { $all: [user_id] },
  }).populate("from to"); */

  console.log(audio_calls);

  for (let elm of audio_calls) {
    const missed = elm.verdict !== "Accepted";
    if (elm.from._id.toString() === user_id.toString()) {
      const other_user = elm.to;

      // outgoing
      call_logs.push({
        id: elm._id,
        img: other_user.avatar,
        name: other_user.firstName,
        online: true,
        incoming: false,
        missed,
      });
    } else {
      // incoming
      const other_user = elm.from;

      // outgoing
      call_logs.push({
        id: elm._id,
        img: other_user.avatar,
        name: other_user.firstName,
        online: true,
        incoming: false,
        missed,
      });
    }
  }

  /*  for (let element of video_calls) {
    const missed = element.verdict !== "Accepted";
    if (element.from._id.toString() === user_id.toString()) {
      const other_user = element.to;

      // outgoing
      call_logs.push({
        id: element._id,
        img: other_user.avatar,
        name: other_user.firstName,
        online: true,
        incoming: false,
        missed,
      });
    } else {
      // incoming
      const other_user = element.from;

      // outgoing
      call_logs.push({
        id: element._id,
        img: other_user.avatar,
        name: other_user.firstName,
        online: true,
        incoming: false,
        missed,
      });
    }
  } */

  res.status(200).json({
    status: "success",
    message: "Call Logs Found successfully!",
    data: call_logs,
  });
};
