const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Blood Information sub-schema
const bloodInfoSchema = new Schema(
  {
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-","Unspecificied"],
    },
    volume: { type: Number, required: true }, // Measured in ml
    tested: { type: Boolean, default: false }, // If the blood has been tested
  },
  {
    _id: false, // This line ensures that no additional ID is created for this sub-document
  }
);

// Main BloodDonation schema
const BloodDonationSchema = new Schema(
  {
    available: { type: Boolean, default: true },
    donor: { type: Schema.Types.ObjectId, ref: "Donor", required: true },
    bloodInfo: { type: bloodInfoSchema, required: true },
    center: { type: Schema.Types.ObjectId, ref: "BloodCenter", required: true },
    centerSite: {
      type: Schema.Types.ObjectId,
      ref: "BloodCenterSite",
      required: true,
    },
    isActive: { type: Boolean, default: true },
    collectedBy: { type: String, required: true }, // Name or ID of the person who collected the blood
    vitalSign:{
      type: Schema.Types.ObjectId,
      ref: "VitalSign",
    },
    startTime: { type: Date },
    endTime: { type: Date },
    reason: { type: String },
    barcode:{}
  },
  {
    timestamps: true, // Enables automatic creation of createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("BloodDonation", BloodDonationSchema);
