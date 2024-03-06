const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Question Schema
const QuestionAnswerSchema = new Schema({
  duplicateId: {
    type: String,
  },
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
  answer: {
    type: Schema.Types.Mixed,
    // required: [true, "Answer is required"],
  },
  required: {
    type: Boolean,
    default: true,
  },
});

// Main PreDonationAssessment schema
const PreDonationAssessmentSchema = new Schema(
  {
    available: {
      type: Boolean,
      default: true,
    },
    center: {
      type: Schema.Types.ObjectId,
      ref: "BloodCenter",
    },
    centerSite: {
      type: Schema.Types.ObjectId,
      ref: "BloodCenterSite",
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
    healthQuestionnaire: [QuestionAnswerSchema],
    isEligible: { type: Boolean },
    remarks: { type: String },
    assessedBy: { type: Schema.Types.ObjectId, ref: "Account" },
    requestedDate: { type: Date },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true, // Enables automatic creation of createdAt and updatedAt fields
  }
);

module.exports = mongoose.model(
  "PreDonationAssessment",
  PreDonationAssessmentSchema
);
