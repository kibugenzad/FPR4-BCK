const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the club-member schema
const ChatSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    receiver: {
      //Group id, or personal id
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    file: {
      type: [String],
      required: true,
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

module.exports = mongoose.model("Chat", ChatSchema);
