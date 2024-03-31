const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const ObjectId = mongoose.Types.ObjectId;
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

  socket.on("get_direct_conversations", async ({ user_id }, callback) => {
    const existing_conversations = await OneToOneMessage.find({
      participants: { $all: [user_id] },
    }).populate("participants", "firstName lastName avatar _id email status");

    console.log(existing_conversations);

    callback(existing_conversations);
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
  socket.on("text_message", async (data) => {
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

  // Handle delete_message event
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
