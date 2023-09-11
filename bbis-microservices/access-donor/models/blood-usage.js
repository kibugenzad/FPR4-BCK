const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Main BloodUsage schema
const BloodUsageSchema = new Schema(
  {
    available: { type: Boolean, default: true },
    donation: {
      type: Schema.Types.ObjectId,
      ref: "BloodDonation",
      required: true,
    },
    requester: {
      name: { type: String, required: true },
      position: { type: String, required: true },
    },
    hospital: { type: Schema.Types.ObjectId, ref: "Hospital", required: true },
    isActive: { type: Boolean, default: true },
    usageDate: { type: Date, required: true },
    reason: { type: String, required: true },
  },
  {
    timestamps: true, // Enables automatic creation of createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("BloodUsage", BloodUsageSchema);
