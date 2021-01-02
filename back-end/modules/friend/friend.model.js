const mongoose = require("mongoose");
const { schema } = require("../users/users.model");
// _userId
// friends

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
FriendSchema.index({fullName: "text"});
const FriendModel = mongoose.model("Friend", FriendSchema);

module.exports = FriendModel;
