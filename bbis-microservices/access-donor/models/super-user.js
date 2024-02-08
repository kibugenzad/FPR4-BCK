/*
super-user model
*/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create account schema
// Define the super-user schema
const SuperUserSchema = new Schema(
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
    email: {
      type: String,
      required: [true, "Email field is required"],
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
      required: [true, "Password field is required"],
    },
    passcode: {
      type: String,
      default: null,
    },
    position: [
      {
        type: Schema.Types.ObjectId,
        ref: "department",
      },
    ],
    pin: {
      type: String,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
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
      username: 1,
    },
  }
);

// Create the model based on the schema
const SuperUser = mongoose.model("SuperUser", SuperUserSchema);

module.exports = SuperUser;
