const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HospitalSchema = new Schema(
  {
    available: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      province: String,
      district: String,
      sector: String,
      cell: String,
      village: String,
    },
    type: {
      type: String,
      enum: ["Public", "Private", "Military", "Research"],
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Hospital = mongoose.model("Hospital", HospitalSchema);

module.exports = Hospital;
