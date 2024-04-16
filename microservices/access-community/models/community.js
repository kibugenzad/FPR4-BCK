const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommunitySchema = new Schema(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    available: {
      type: Boolean,
      default: true,
    },
    audience: {
      type: [String],
      required: true,
      default: "citizen",
      enum: ["citizen", "diaspora", "foreign"],
    },
    category: {
      type: String,
      required: true,
      enum: ["public", "private"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Community", CommunitySchema);
