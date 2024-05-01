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
