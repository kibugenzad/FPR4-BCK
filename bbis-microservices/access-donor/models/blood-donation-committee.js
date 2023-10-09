const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Main BloodDonationCommittee schema
const BloodDonationCommitteeSchema = new Schema(
  {
    available: { type: Boolean, default: true },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    center: {
      type: Schema.Types.ObjectId,
      ref: "BloodCenter",
      required: true,
    },
    centerSite: {
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
  "BloodDonationCommittee",
  BloodDonationCommitteeSchema
);
