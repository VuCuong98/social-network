const { string, boolean } = require("@hapi/joi");
const mongoose = require("mongoose");

// UserId
// type

const NotifySchema = new mongoose.Schema(
  {
    _userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    notify: {
      type: String,
    },
    seen: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

const NotifyModel = mongoose.model("Notify", NotifySchema);
module.exports = NotifyModel;
