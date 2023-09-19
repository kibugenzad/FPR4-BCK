const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Packages sub-schema
const packagesSchema = new Schema(
  {
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    numberOfPackages: { type: Number, required: true },
  },
  {
    _id: false,
  }
);

// Main BloodRequest schema
const BloodRequestSchema = new Schema(
  {
    available: { type: Boolean, default: true },
    linkedEntity: {
      distributor: {
        type: Schema.Types.ObjectId,
        ref: "BloodDistributor",
        required: false,
      },
      hospital: {
        type: Schema.Types.ObjectId,
        ref: "Hospital",
        required: false,
      },
    },
    description: { type: String, required: true },
    packages: { type: [packagesSchema], required: true },
    approvals: [
      {
        account: {
          type: Schema.Types.ObjectId,
          ref: "Account",
          required: true,
        },
        level: {
          type: Number,
          required: true,
        },
        approved: {
          type: Boolean,
          default: false,
        },
        approvedAt: Date,
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true, // Enables automatic creation of createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("BloodRequest", BloodRequestSchema);
