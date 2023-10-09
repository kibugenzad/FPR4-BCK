const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BloodTestSchema = new Schema(
  {
    // Blood Test Results
    hemoglobin: {
      type: Number,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    hepatitisB: {
      type: Boolean,
      required: true,
    },
    hepatitisC: {
      type: Boolean,
      required: true,
    },
    hiv: {
      type: Boolean,
      required: true,
    },
    syphilis: {
      type: Boolean,
      required: true,
    },
    // Link to Site Schema
    centerSite: {
      type: Schema.Types.ObjectId,
      ref: "BloodCenterSite",
      required: true,
    },
    // Link to Donation Schema
    donation: {
      type: Schema.Types.ObjectId,
      ref: "BloodDonation",
      required: true,
    },
    // Approval - Can have multiple levels
    approvals: [
      {
        account: {
          type: Schema.Types.ObjectId,
          ref: "Account",
          required: true,
        },
        level: {
          type: Number,
          required: true,
        },
        approved: {
          type: Boolean,
          default: false,
        },
        approvedAt: Date,
      },
    ],
    // Other metadata like timestamps
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BloodTest", BloodTestSchema);
