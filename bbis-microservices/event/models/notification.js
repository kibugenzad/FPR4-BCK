/*
notification
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Notification Schema & model
const NotificationSchema = new Schema(
  {
    account: [
      { type: Schema.ObjectId, required: [true, "Account ID required"] },
    ],
    available: { type: Boolean, default: true },
    body: { type: String, required: [true, "Body field is required"] },
    targetScreen: { type: String },
    title: { type: String },
    user: [{ type: Schema.ObjectId, required: [true, "User ID required"] }],
    viewed: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Automatically include createdAt and updatedAt fields
    index: { account: 1, user: 1 }, // Compound index on "account" and "user"
  }
);

const Notification = mongoose.model("notification", NotificationSchema);
module.exports = Notification;
