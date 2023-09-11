const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Main BloodDonationCampaign schema
const BloodDonationCampaignSchema = new Schema({
  // Future Date
  campaignDate: { type: Date, required: true, min: Date.now },

  // Estimated Collection (in units, for example)
  estimatedCollection: { type: Number, required: true },

  // Actual Collection (in units)
  actualCollection: { type: Number, default: 0 },

  // ID linking to the Blood Center schema
  bloodCenter: { type: Schema.Types.ObjectId, ref: 'BloodCenter', required: true },

  // ID linking to the Blood Center Site schema
  bloodCenterSite: { type: Schema.Types.ObjectId, ref: 'BloodCenterSite', required: true },

  // Additional Fields
  isActive: { type: Boolean, default: true },
  
}, {
  timestamps: true  // Enables automatic creation of createdAt and updatedAt fields
});

module.exports = mongoose.model('BloodDonationCampaign', BloodDonationCampaignSchema);
