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
      type: Schema.Types.ObjectId,
      ref: "BloodCenter",
      required: true,
    },
    centerSite: {
      type: Schema.Types.ObjectId,
      ref: "BloodCenterSite",
      required: true,
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
