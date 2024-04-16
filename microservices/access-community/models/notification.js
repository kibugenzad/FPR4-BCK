const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
  {
    user: {
      type: [Schema.Types.ObjectId],
      ref: "Account",
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: String,
      default: 0,
    },
    type: {
      type: String,
      default: 0,
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

module.exports = mongoose.model("Notification", NotificationSchema);
