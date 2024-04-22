const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupMessageSchema = new Schema({
  id: { type: String },
  title: { type: String, required: true },
  friends: [{ type: Array, ref: "User" }],
});

const GroupMessage = mongoose.model("GroupMessage", groupMessageSchema);

module.exports = GroupMessage;
