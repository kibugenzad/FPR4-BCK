const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StorySchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    content: {
      type: String,
    },
    file: {
      type: [],
    },
    read: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "#000000",
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

module.exports = mongoose.model("Story", StorySchema);
