const mongoose = require("mongoose");
// sender
// receiver

const RequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamp: true }
);

const RequestModel = mongoose.model("RequestAdd", RequestSchema);

module.exports = RequestModel;
