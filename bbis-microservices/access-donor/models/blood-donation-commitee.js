const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Main BloodDonationCommittee schema
const BloodDonationCommitteeSchema = new Schema({
  // Committee Name
  name: { type: String, required: true },

  // Contact Information
  contact: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },

  // ID linking to the Site schema
  site: { type: Schema.Types.ObjectId, ref: 'Site', required: true },

  // Additional Fields
  isActive: { type: Boolean, default: true },

}, {
  timestamps: true  // Enables automatic creation of createdAt and updatedAt fields
});

module.exports = mongoose.model('BloodDonationCommittee', BloodDonationCommitteeSchema);
