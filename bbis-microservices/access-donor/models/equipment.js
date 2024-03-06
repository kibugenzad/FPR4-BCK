const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EquipmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    }
   
  },
  {
    timestamps: true,
  }
);

const Equipment = mongoose.model("Equipment", EquipmentSchema);

module.exports = Equipment;
