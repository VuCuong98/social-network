const mongoose = require("mongoose");

// member [user1, user2]
// messages [{user1, message, createdAt}, {user2, message, createdAt}];

const MessageSchema = new mongoose.Schema({
  members: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ],
  conversation: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      message: { type: String },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, {
    timestamps: true,
});

 const MessageModel = mongoose.model("Message", MessageSchema);
module.exports = MessageModel;