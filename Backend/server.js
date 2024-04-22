const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const { Types } = mongoose;
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
process.on("uncaughtException", (err) => {
  console.log(err);
  process.exit(1);
});

const app = require("./app");

const path = require("path");
const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const User = require("./models/user");
const FriendRequest = require("./models/friendRequest");
const OneToOneMessage = require("./models/OneToOneMessage");
const GroupMessage = require("./models/GroupMessage");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const DB = process.env.DBURL;

mongoose
  .connect(DB)
  .then((con) => {
    console.log("DB Connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`App running on port ${port}`);
});

io.on("connection", async (socket) => {
  console.log(JSON.stringify(socket.handshake.query));
  const user_id = socket.handshake.query["user_id"];

  console.log(`User connected ${socket.id}`);

  if (user_id != null && Boolean(user_id)) {
    try {
      User.findByIdAndUpdate(user_id, {
        socket_id: socket.id,
        status: "Online",
      });
    } catch (e) {
      console.log(e);
    }
  }

  // friend request
  socket.on("friend_request", async (data) => {
    try {
      // Save friend request to database
      await FriendRequest.create({
        sender: data.from,
        recipient: data.to,
      });

      // Get recipient and sender socket_ids from database
      const toUser = await User.findById(data.to).select("socket_id");
      const fromUser = await User.findById(data.from).select("socket_id");

      // Emit events to sender and recipient
      if (toUser) {
        io.to(toUser.socket_id).emit("new_friend_request", {
          message: "New friend request received",
        });
      }

      if (fromUser) {
        io.to(fromUser.socket_id).emit("request_sent", {
          message: "Request Sent successfully!",
        });
      }

      console.log("Request sent successfully");
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("accept_request", async (data) => {
    try {
      // Find the friend request document
      const request_doc = await FriendRequest.findById(data.request_id);

      if (!request_doc) {
        throw new Error("Friend request not found");
      }

      // Find the sender and receiver users
      const sender = await User.findById(request_doc.sender);
      const receiver = await User.findById(request_doc.recipient);

      if (!sender || !receiver) {
        throw new Error("Sender or receiver not found");
      }

      // Update sender and receiver friend lists
      sender.friends.push(request_doc.recipient);
      receiver.friends.push(request_doc.sender);

      // Save the updated sender and receiver documents
      await Promise.all([receiver.save(), sender.save()]);

      // Emit event request accepted to both sender and receiver
      io.to(sender.socket_id).emit("request_accepted", {
        message: "Friend Request Accepted",
      });

      io.to(receiver.socket_id).emit("request_accepted", {
        message: "Friend Request Accepted",
      });

      // Delete the friend request
      await FriendRequest.findByIdAndDelete(data.request_id);

      console.log("Friend request accepted successfully");
    } catch (error) {
      console.error("Error accepting friend request:", error.message);
      // Handle the error as needed
    }
  });

  socket.on("refuse_request", async (data) => {
    try {
      // Find the friend request document
      const request_doc = await FriendRequest.findById(data.request_id);

      if (!request_doc) {
        throw new Error("Friend request not found");
      }

      // Find the sender and receiver users
      const sender = await User.findById(request_doc.sender);
      const receiver = await User.findById(request_doc.recipient);

      if (!sender || !receiver) {
        throw new Error("Sender or receiver not found");
      }

      // Emit event request refused to sender
      io.to(sender.socket_id).emit("request_refused", {
        message: "Friend Request Refused",
      });

      // Delete the friend request
      await FriendRequest.findByIdAndDelete(data.request_id);

      console.log("Friend request refused successfully");
    } catch (error) {
      console.error("Error refusing friend request:", error.message);
      // Handle the error as needed
    }
  });

  socket.on("delete_friend", async (data) => {
    try {
      // Find the sender and receiver users
      const sender = await User.findById(data.sender_id);
      const receiver = await User.findById(data.receiver_id);

      if (!sender || !receiver) {
        throw new Error("Sender or receiver not found");
      }

      // Remove receiver from sender's friend list
      sender.friends = sender.friends.filter(
        (friendId) => friendId.toString() !== receiver._id.toString()
      );

      // Remove sender from receiver's friend list
      receiver.friends = receiver.friends.filter(
        (friendId) => friendId.toString() !== sender._id.toString()
      );

      // Save the updated sender and receiver documents
      await Promise.all([sender.save(), receiver.save()]);

      // Emit event friend deleted to both sender and receiver
      io.to(sender.socket_id).emit("friend_deleted", {
        message: "Your friend has been deleted",
      });

      io.to(receiver.socket_id).emit("friend_deleted", {
        message: "You have been deleted by a friend",
      });

      console.log("Friend deleted successfully");
    } catch (error) {
      console.error("Error deleting friend:", error.message);
      // Handle the error as needed
    }
  });

  socket.on("get_direct_conversations", async ({ user_id }, callback) => {
    const existing_conversations = await OneToOneMessage.find({
      participants: { $all: [user_id] },
    }).populate("participants", "firstName lastName avatar _id email status");

    console.log(existing_conversations);

    callback(existing_conversations);
  });

  socket.on("get_group_conversations", async (data, callback) => {
    try {
      const { id } = data;

      const existing_group_conversations = await GroupMessage.find({
        id: { $all: id },
      }).populate("title", "title");

      console.log("existing_group_conversations", existing_group_conversations);

      callback(existing_group_conversations);
    } catch (error) {
      // Handle any errors that occur during the query
      console.error("Error fetching group conversations:", error);
      callback({
        error: "An error occurred while fetching group conversations",
      });
    }
  });

  socket.on("start_conversation", async (data) => {
    // data: {to: from:}
    const { to, from } = data;

    // check if there is any existing conversation
    const existing_conversations = await OneToOneMessage.find({
      participants: { $size: 2, $all: [to, from] },
    }).populate("participants", "firstName lastName _id email status");

    console.log(existing_conversations[0], "Existing Conversation");

    // if no => create a new OneToOneMessage doc & emit event "start_chat" & send conversation details as payload
    if (existing_conversations.length === 0) {
      let new_chat = await OneToOneMessage.create({
        participants: [to, from],
      });

      new_chat = await OneToOneMessage.findById(new_chat).populate(
        "participants",
        "firstName lastName _id email status"
      );

      console.log(new_chat);

      socket.emit("start_chat", new_chat);
    }
    // if yes => just emit event "start_chat" & send conversation details as payload
    else {
      socket.emit("start_chat", existing_conversations[0]);
    }
  });

  // Event listener for deleting conversation
  socket.on("delete_conversation", async (data) => {
    const { conversationId } = data;

    // Validate that conversationId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      // If not valid, emit an error event
      return socket.emit("conversation_deleted", {
        success: false,
        error: "Invalid conversation ID format.",
      });
    }

    try {
      // Find the conversation to check if it exists before deleting
      const conversation = await OneToOneMessage.findById(conversationId);
      if (!conversation) {
        // If conversation doesn't exist, emit an error event
        return socket.emit("conversation_deleted", {
          success: false,
          error: "Conversation not found.",
        });
      }

      // Delete the conversation
      await OneToOneMessage.findByIdAndDelete(conversationId);

      // Emit event to confirm deletion
      socket.emit("conversation_deleted", { success: true });
    } catch (error) {
      // Handle errors gracefully
      console.error("Error deleting conversation:", error);
      socket.emit("conversation_deleted", {
        success: false,
        error: "An error occurred while deleting conversation.",
      });
    }
  });

  // Event handler for starting a new group conversation
  socket.on("start_group_conversation", async (data) => {
    console.log("Received start_group_conversation event");

    // Check if data is null or undefined
    if (!data) {
      console.error("Received null or undefined data");
      return;
    }

    // Extract title and friends from the data object
    const { title, friends } = data;

    try {
      // Check if there is any existing group conversation with exactly the same participants
      const existingConversation = await GroupMessage.findOne({
        friends: { $size: friends.length, $all: friends },
      }).populate("friends", "firstName lastName");

      console.log(existingConversation, "Existing Group Conversation");

      // If no existing group conversation, create a new one
      if (!existingConversation) {
        let newGroupConversation = await GroupMessage.create({
          title: title,
          friends: friends,
        });

        newGroupConversation = await GroupMessage.findById(
          newGroupConversation._id
        ).populate("friends", "firstName lastName");

        console.log(newGroupConversation);

        // Emit event "start_group_chat" with new group conversation details
        socket.emit("start_group_chat", newGroupConversation);
      } else {
        // If group conversation already exists, emit event "start_group_chat" with existing details
        socket.emit("start_group_chat", existingConversation);
      }
    } catch (error) {
      console.error(
        "Error while creating or finding group conversation:",
        error.message
      );
    }
  });

  socket.on("get_messages", async (data, callback) => {
    try {
      const conversation = await OneToOneMessage.findById(data.conversation_id)
        .select("messages")
        .lean();

      if (!conversation) {
        throw new Error("Conversation not found");
      }

      const { messages } = conversation || {};

      if (!messages) {
        console.log("No messages found for this conversation");
        callback([]);
        return;
      }

      const sortedMessages = messages.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      callback(sortedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error.message);
      callback({ error: error.message });
    }
  });

  // Handle incoming text/link messages
  socket.on("text_message", async (data, callback) => {
    console.log("Received message:", data);

    // data: {to, from, text}
    const { message, conversation_id, from, to, type } = data;

    const to_user = await User.findById(to);
    const from_user = await User.findById(from);

    // message => {to, from, type, created_at, text, file}
    const new_message = {
      to: to,
      from: from,
      type: type,
      created_at: Date.now(),
      text: message,
    };

    // fetch OneToOneMessage Doc & push a new message to existing conversation
    const chat = await OneToOneMessage.findById(conversation_id);
    chat.messages.push(new_message);
    // save to db`
    await chat.save({ new: true, validateModifiedOnly: true });

    // emit incoming_message -> to user
    io.to(to_user?.socket_id).emit("new_message", {
      conversation_id,
      message: new_message,
    });

    // emit outgoing_message -> from user
    io.to(from_user?.socket_id).emit("new_message", {
      conversation_id,
      message: new_message,
    });
    callback(chat);
  });

  // handle Media/Document Message
  socket.on("file_message", (data) => {
    console.log("Received message:", data);

    // data: {to, from, text, file}
    // Get the file extension
    const fileExtension = path.extname(data.file.name);

    // Generate a unique filename
    const filename = `${Date.now()}_${Math.floor(
      Math.random() * 10000
    )}${fileExtension}`;

    // upload file to AWS s3

    // create a new conversation if its dosent exists yet or add a new message to existing conversation

    // save to db

    // emit incoming_message -> to user

    // emit outgoing_message -> from user
  });

  // Handle delete message event
  socket.on("delete_message", async (messageId) => {
    try {
      const deletedMessage = await OneToOneMessage.findOneAndUpdate(
        { "messages._id": messageId },
        { $pull: { messages: { _id: messageId } } },
        { new: true }
      );

      if (deletedMessage) {
        io.emit("message_deleted", messageId);
        console.log(`Deleted message with ID: ${messageId}`);
      } else {
        console.log(`Message with ID ${messageId} not found`);
      }
    } catch (error) {
      console.error("Error deleting message:", error.message);
    }
  });

  // -------------- HANDLE AUDIO CALL SOCKET EVENTS ----------------- //

  // handle start_audio_call event
  socket.on("start_audio_call", async (data) => {
    try {
      const { from, to, roomID } = data;

      // Check if from and to user IDs are provided
      if (!from || !to) {
        throw new Error("Invalid 'from' or 'to' user ID");
      }

      // Find the sender (from_user) and receiver (to_user) users
      const from_user = await User.findById(from);
      const to_user = await User.findById(to);

      // Check if sender and receiver exist
      if (!from_user || !to_user) {
        throw new Error("Sender or receiver not found");
      }

      // Check if roomID is provided
      if (!roomID) {
        throw new Error("Invalid room ID");
      }

      // Emit audio call notification to the receiver
      io.to(to_user.socket_id).emit("audio_call_notification", {
        from: {
          _id: from_user._id,
          username: from_user.username,
        },
        roomID,
      });

      console.log("Audio call notification sent to", to_user.username);
    } catch (error) {
      console.error("Error starting audio call:", error.message);
      // Handle the error as needed
    }
  });

  // handle audio_call_not_picked
  socket.on("audio_call_not_picked", async (data) => {
    try {
      // Ensure required data is provided
      const { to, from } = data;
      if (!to || !from) {
        throw new Error("Invalid 'to' or 'from' user ID");
      }

      // Find the receiver (to_user)
      const to_user = await User.findById(to);

      // Check if receiver exists
      if (!to_user) {
        throw new Error("Receiver user not found");
      }

      // Find and update the audio call record
      const updatedCall = await AudioCall.findOneAndUpdate(
        {
          participants: { $size: 2, $all: [to, from] },
          status: "Pending", // You might adjust this status check based on your implementation
        },
        { verdict: "Missed", status: "Ended", endedAt: Date.now() },
        { new: true } // Return the updated document
      );

      if (!updatedCall) {
        throw new Error("Audio call record not found or already ended");
      }

      // Emit audio call missed event to the receiver
      io.to(to_user.socket_id).emit("audio_call_missed", {
        from,
        to,
      });

      console.log(
        "Audio call marked as missed and notification sent to",
        to_user.username
      );
    } catch (error) {
      console.error("Error handling audio call not picked:", error.message);
      // Handle the error as needed
    }
  });

  // handle audio_call_accepted
  socket.on("audio_call_accepted", async (data) => {
    try {
      // Ensure required data is provided
      const { to, from } = data;
      if (!to || !from) {
        throw new Error("Invalid 'to' or 'from' user ID");
      }

      // Find the sender (from_user)
      const from_user = await User.findById(from);

      // Check if sender exists
      if (!from_user) {
        throw new Error("Sender user not found");
      }

      // Find and update the audio call record
      const updatedCall = await AudioCall.findOneAndUpdate(
        {
          participants: { $size: 2, $all: [to, from] },
          status: "Pending", // You might adjust this status check based on your implementation
        },
        { verdict: "Accepted" },
        { new: true } // Return the updated document
      );

      if (!updatedCall) {
        throw new Error("Audio call record not found or already accepted");
      }

      // Emit audio call accepted event to the sender
      io.to(from_user.socket_id).emit("audio_call_accepted", {
        from,
        to,
      });

      console.log(
        "Audio call marked as accepted and notification sent to",
        from_user.username
      );
    } catch (error) {
      console.error("Error handling audio call accepted:", error.message);
      // Handle the error as needed
    }
  });

  // handle audio_call_denied
  socket.on("audio_call_denied", async (data) => {
    try {
      // Ensure required data is provided
      const { to, from } = data;
      if (!to || !from) {
        throw new Error("Invalid 'to' or 'from' user ID");
      }

      // Find and update the audio call record
      const updatedCall = await AudioCall.findOneAndUpdate(
        {
          participants: { $size: 2, $all: [to, from] },
          status: "Pending", // You might adjust this status check based on your implementation
        },
        { verdict: "Denied", status: "Ended", endedAt: Date.now() },
        { new: true } // Return the updated document
      );

      if (!updatedCall) {
        throw new Error("Audio call record not found or already ended");
      }

      // Find the sender (from_user)
      const from_user = await User.findById(from);

      // Check if sender exists
      if (!from_user) {
        throw new Error("Sender user not found");
      }

      // Emit audio call denied event to the sender
      io.to(from_user.socket_id).emit("audio_call_denied", {
        from,
        to,
      });

      console.log(
        "Audio call marked as denied and notification sent to",
        from_user.username
      );
    } catch (error) {
      console.error("Error handling audio call denied:", error.message);
      // Handle the error as needed
    }
  });

  // handle user_is_busy_audio_call
  socket.on("user_is_busy_audio_call", async (data) => {
    try {
      // Ensure required data is provided
      const { to, from } = data;
      if (!to || !from) {
        throw new Error("Invalid 'to' or 'from' user ID");
      }

      // Find and update the audio call record
      const updatedCall = await AudioCall.findOneAndUpdate(
        {
          participants: { $size: 2, $all: [to, from] },
          status: "Pending", // You might adjust this status check based on your implementation
        },
        { verdict: "Busy", status: "Ended", endedAt: Date.now() },
        { new: true } // Return the updated document
      );

      if (!updatedCall) {
        throw new Error("Audio call record not found or already ended");
      }

      // Find the sender (from_user)
      const from_user = await User.findById(from);

      // Check if sender exists
      if (!from_user) {
        throw new Error("Sender user not found");
      }

      // Emit "on_another_audio_call" event to the sender
      io.to(from_user.socket_id).emit("on_another_audio_call", {
        from,
        to,
      });

      console.log(
        "Audio call marked as busy and notification sent to",
        from_user.username
      );
    } catch (error) {
      console.error(
        "Error handling user is busy in audio call:",
        error.message
      );
      // Handle the error as needed
    }
  });

  socket.on("end", async (data) => {
    // Find user by ID and set status as offline
    if (data.user_id) {
      await User.findByIdAndUpdate(data.user_id, { status: "Offline" });
    }

    // broadcast to all conversation rooms of this user that this user is offline (disconnected)
    console.log("closing connection");
    socket.disconnect(0);
  });
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log("UNHANDLED REJECTION! Shutting down ...");
  server.close(() => {
    process.exit(1);
  });
});
