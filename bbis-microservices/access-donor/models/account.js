//Written by Huzalabs
//_______________________________
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    department: [
      {
        type: Schema.Types.ObjectId,
        ref: "Department",
        required: [true, "department field is required"],
      },
    ],
    email: {
      type: String,
      required: [true, "email field is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    employeeId: {
      type: String,
      required: [true, "employeeId field is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password field is required"],
    },
    passcode: {
      type: String,
      default: null,
    },
    position: [
      {
        type: Schema.Types.ObjectId,
        ref: "Position",
        required: [true, "position field is required"],
      },
    ],
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
      username: 1,
    },
  }
);

// Create the model based on the schema
const Account = mongoose.model("Account", AccountSchema);

module.exports = Account;
