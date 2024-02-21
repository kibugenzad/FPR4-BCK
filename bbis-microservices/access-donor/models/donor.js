/*
Donor model
*/
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

// Create account schema
// Define the donor schema
const DonorSchema = new Schema(
  {
    accesRole: [
      {
        type: Schema.Types.ObjectId,
        ref: "accessRole",
      },
    ],
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
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    passcode: {
      type: String,
      default: null,
    },
    dateOfBirth: {
      type: String,
      default: null,
    },
    donorNumber: {
      type: String,
      required: [true, "donorNumber field is required"],
      unique: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, "firstName is required"],
    },
    lastName: {
      type: String,
      required: [true, "lastName is required"],
    },
    verified: {
      type: Boolean,
      default: true,
    },
    registrationQuestionnaire: [QuestionAnswerSchema],
  },
  {
    timestamps: true,
    index: {
      email: 1,
      Donorname: 1,
    },
  }
);

// Create the model based on the schema
const Donor = mongoose.model("Donor", DonorSchema);

module.exports = Donor;
