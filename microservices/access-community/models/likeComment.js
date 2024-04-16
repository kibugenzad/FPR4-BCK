const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LikeCommentSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
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

module.exports = mongoose.model("LikeComment", LikeCommentSchema);
