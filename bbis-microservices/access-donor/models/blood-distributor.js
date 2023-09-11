const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Address sub-schema
const addressSchema = new Schema({
  province: { type: String, required: true },
  district: { type: String, required: true },
  sector: { type: String, required: true },
  cell: { type: String, required: true },
  village: { type: String, required: true },
  lat: { type: Number, required: true },
  long: { type: Number, required: true },
}, {
  _id: false // This line ensures that no additional ID is created for this sub-document
});

// Main BloodDistributor schema
const BloodDistributorSchema = new Schema({
  // Distributor Name
  name: { type: String, required: true },

  // Address Object
  address: { type: addressSchema, required: true },

  // Contact Information
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },

  // Additional Fields
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true  // Enables automatic creation of createdAt and updatedAt fields
});

module.exports = mongoose.model('BloodDistributor', BloodDistributorSchema);
