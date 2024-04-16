const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LikePostSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LikePost", LikePostSchema);
