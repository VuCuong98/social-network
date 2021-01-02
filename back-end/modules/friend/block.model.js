const mongoose = require("mongoose");

// _userId
// friends

const BlockSchema = mongoose.Schema(
  {
    _userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    block: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    ],
  },
  { timestamp: true }
);
const BlockModel = mongoose.model("Block", BlockSchema);

module.exports = BlockModel;
