const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Blood Information sub-schema
const bloodInfoSchema = new Schema({
  bloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  rhFactor: { type: String, required: true, enum: ['Positive', 'Negative'] },
  volume: { type: Number, required: true },  // Measured in ml
  tested: { type: Boolean, default: false }, // If the blood has been tested
  expirationDate: { type: Date, required: true }, // Expiration date for the donated blood
}, {
  _id: false // This line ensures that no additional ID is created for this sub-document
});

// Main BloodDonation schema
const BloodDonationSchema = new Schema({
  // ID linking to the Donor schema
  donor: { type: Schema.Types.ObjectId, ref: 'Donor', required: true },

  // Blood Information Object
  bloodInfo: { type: bloodInfoSchema, required: true },

  // ID linking to the Site schema
  site: { type: Schema.Types.ObjectId, ref: 'Site', required: true },

  // Additional Fields
  isActive: { type: Boolean, default: true },
  collectedBy: { type: String, required: true }, // Name or ID of the person who collected the blood

}, {
  timestamps: true  // Enables automatic creation of createdAt and updatedAt fields
});

module.exports = mongoose.model('BloodDonation', BloodDonationSchema);
