//Written by Huzalabs
//_______________________________
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema(
  {
    country: { type: String, required: true },
    city: { type: String },
    province: { type: String },
    district: { type: String },
    sector: { type: String },
    cell: { type: String },
    village: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  {
    _id: false, // This line ensures that no additional ID is created for this sub-document
  }
);

// Define the account schema
const AccountSchema = new Schema(
  {
    active: {
      type: Boolean,
      default: true,
    },
    accessRole: [
      {
        type: Schema.Types.ObjectId,
        ref: "accessRole",
        required: [true, "accessRole field is required"],
      },
    ],
    available: {
      type: Boolean,
      default: true,
    },
    gender: {
      type: String,
    },
    dob: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "email field is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "phone number field is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password field is required"],
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    photo: {
      type: String,
    },
    address: addressSchema,
    category: {
      type: String,
      default: "citizen",
      enum: ["citizen", "diaspora", "foreign"],
    },
    following: {
      type: Number,
      default: 0,
    },
    followed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create the model based on the schema
const Account = mongoose.model("Account", AccountSchema);

module.exports = Account;
