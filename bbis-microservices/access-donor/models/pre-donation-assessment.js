const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Question Schema
const QuestionSchema = new Schema({
  questionText: {
    type: String,
    required: [true, "Question text is required"],
  },
  options: [
    {
      type: String,
    },
  ],
  answerType: {
    // for example, 'text', 'multipleChoice', etc
    type: String,
    required: [true, "Answer type is required"],
  },
});

// Main PreDonationAssessment schema
const PreDonationAssessmentSchema = new Schema(
  {
    available: {
      type: Boolean,
      default: true,
    },
    donor: { type: Schema.Types.ObjectId, ref: "Donor", required: true },
    weight: { type: Number },
    temperature: { type: Number },
    bloodPressure: {
      systolic: { type: Number },
      diastolic: { type: Number },
    },
    pulseRate: { type: Number },
    hemoglobinLevel: { type: Number },
    healthQuestionnaire: [QuestionSchema],
    isEligible: { type: Boolean },
    remarks: { type: String },
    assessedBy: { type: Schema.Types.ObjectId, ref: "Account" },
  },
  {
    timestamps: true, // Enables automatic creation of createdAt and updatedAt fields
  }
);

module.exports = mongoose.model(
  "PreDonationAssessment",
  PreDonationAssessmentSchema
);
