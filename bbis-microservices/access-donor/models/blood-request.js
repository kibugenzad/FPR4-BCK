const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Packages sub-schema
const packagesSchema = new Schema({
  bloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  numberOfPackages: { type: Number, required: true },
}, {
  _id: false
});

// Approval sub-schema
const approvalSchema = new Schema({
  account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  level: { type: String, required: true, enum: ['Low', 'Medium', 'High'] },
  status: { type: String, required: true, enum: ['Pending', 'Approved', 'Rejected'] },
}, {
  _id: false
});

// Main BloodRequest schema
const BloodRequestSchema = new Schema({
  // ID linking to the Distributor or Hospital schema
  linkedEntity: {
    distributor: { type: Schema.Types.ObjectId, ref: 'Distributor', required: false },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: false },
  },

  // Description
  description: { type: String, required: true },

  // Number of Packages Grouped by Type
  packages: { type: [packagesSchema], required: true },

  // Approval Sequence
  approvals: { type: [approvalSchema], required: true },

  // Additional Fields
  isActive: { type: Boolean, default: true },
  
}, {
  timestamps: true  // Enables automatic creation of createdAt and updatedAt fields
});

module.exports = mongoose.model('BloodRequest', BloodRequestSchema);
