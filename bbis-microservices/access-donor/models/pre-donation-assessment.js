const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Main PreDonationAssessment schema
const PreDonationAssessmentSchema = new Schema(
  {
    available: {
      type: Boolean,
      default: true,
    },
    weight: { type: Number, required: true },
    temperature: { type: Number, required: true },
    bloodPressure: {
      systolic: { type: Number, required: true },
      diastolic: { type: Number, required: true },
    },
    pulseRate: { type: Number, required: true },
    hemoglobinLevel: { type: Number, required: true },
    healthQuestionnaire: {
      recentIllness: { type: Boolean, required: true },
      recentMedication: { type: Boolean, required: true },
      recentSurgery: { type: Boolean, required: true },
      // to be continued
    },
    isEligible: { type: Boolean, default: false },
    remarks: { type: String },
    assessedBy: { type: Schema.Types.ObjectId, ref: "Account", required: true },
  },
  {
    timestamps: true, // Enables automatic creation of createdAt and updatedAt fields
  }
);

module.exports = mongoose.model(
  "PreDonationAssessment",
  PreDonationAssessmentSchema
);
