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
    weight: { type: Number, required: true },
    temperature: { type: Number, required: true },
    bloodPressure: {
      systolic: { type: Number, required: true },
      diastolic: { type: Number, required: true },
    },
    pulseRate: { type: Number, required: true },
    hemoglobinLevel: { type: Number, required: true },
    healthQuestionnaire: [QuestionSchema],
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
