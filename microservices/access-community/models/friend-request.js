const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the club-member schema
const FriendRequestSchema = new Schema(
  {
    requester: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    requestee: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accepted", "rejected"],
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

module.exports = mongoose.model("FriendRequest", FriendRequestSchema);
