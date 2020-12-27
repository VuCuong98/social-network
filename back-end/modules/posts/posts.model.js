const { date } = require("@hapi/joi");
const mongoose = require("mongoose");
/**
 * author
 * like
 * createdAt
 * content
 * imageUrl
 * comment
 */

const PostSchema = new mongoose.Schema(
  {
    like: {
      type: Array,
    },
    content: {
      type: String,
    },
    imageUrl: {
      type: Array,
    },
    comment: [
      {
        createdAt: {
            type: Date,
            default: Date.now,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
        content: {
            type: String,
        },
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model("Post", PostSchema);

module.exports = PostModel;
