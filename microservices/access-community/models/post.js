const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the club-member schema
const PostSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    community: {
      type: [Schema.Types.ObjectId],
      ref: "Community",
      required: true,
    },
    content: {
      type: String,
    },
    file: {
      type: [String],
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
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

module.exports = mongoose.model("Post", PostSchema);
