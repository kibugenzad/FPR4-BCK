const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommunityMembershipSchema = new Schema(
  {
    community: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    role: {
      type: String,
      default: "member",
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CommunityMember", CommunityMembershipSchema);
