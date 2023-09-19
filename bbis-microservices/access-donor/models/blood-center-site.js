const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema(
  {
    province: { type: String, required: true },
    district: { type: String, required: true },
    sector: { type: String, required: true },
    cell: { type: String, required: true },
    village: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  {
    _id: false, // This line ensures that no additional ID is created for this sub-document
  }
);

const BloodCenterSiteSchema = new Schema(
  {
    center: {
      type: Schema.Types.ObjectId,
      ref: "BloodCenter",
      required: true,
    },
    committeeLeader: {
      type: Schema.Types.ObjectId,
      ref: "BloodDonationCommittee",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: addressSchema,
      required: true,
    },
    contactNumber: {
      type: String,
    },
    email: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
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

module.exports = mongoose.model("BloodCenterSite", BloodCenterSiteSchema);
