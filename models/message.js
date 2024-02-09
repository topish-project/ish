const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  deleted: { type: Boolean, default: false },
  seen: { type: Boolean, default: false }, // Add a 'seen' field
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
