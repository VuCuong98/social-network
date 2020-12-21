const mongoose = require("mongoose");
// _userId
// request

const FriendSchema = mongoose.Schema(
  {
    _userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    friends: [
      { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    ],
  },
  { timestamp: true }
);

const FriendModel = mongoose.model("Friend", FriendSchema);

module.exports = FriendModel;
