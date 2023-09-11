const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Main BloodDonationCampaign schema
const BloodDonationCampaignSchema = new Schema(
  {
    available: { type: Boolean, default: true },
    campaignDate: { type: Date, required: true, min: Date.now },
    estimatedCollection: { type: Number, required: true },
    actualCollection: { type: Number, default: 0 },
    bloodCenter: {
      type: Schema.Types.ObjectId,
      ref: "BloodCenter",
      required: true,
    },
    bloodCenterSite: {
      type: Schema.Types.ObjectId,
      ref: "BloodCenterSite",
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true, // Enables automatic creation of createdAt and updatedAt fields
  }
);

module.exports = mongoose.model(
  "BloodDonationCampaign",
  BloodDonationCampaignSchema
);
