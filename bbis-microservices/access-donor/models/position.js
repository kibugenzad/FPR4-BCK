/*
position model
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Position schema
const PositionSchema = new Schema(
  {
    available: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      required: [true, "name field is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "department field is required"],
    },
  },
  {
    timestamps: true,
    index: {
      name: 1,
    },
  }
);

// Create the model based on the schema
const Position = mongoose.model("Position", PositionSchema);

module.exports = Position;
