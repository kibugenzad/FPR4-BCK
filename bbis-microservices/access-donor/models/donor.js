/*
Donor model
*/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
      type: String,
      required: [true, "center field is required"],
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email field is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password field is required"],
    },
    passcode: {
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
