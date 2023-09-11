const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  province: { type: String, required: true },
  district: { type: String, required: true },
  sector: { type: String, required: true },
  cell: { type: String, required: true },
  village: { type: String, required: true },
}, {
  _id: false // This line ensures that no additional ID is created for this sub-document
});

const BloodCenterSiteSchema = new Schema({
  // ID linking to the Center schema
  center: { type: Schema.Types.ObjectId, ref: 'Center', required: true },

  // ID linking to the Blood Donation Committee schema
  committeeLeader: { type: Schema.Types.ObjectId, ref: 'Committee', required: true },

  // Site Name
  name: { type: String, required: true },

  // Site Code
  code: { type: String, required: true, unique: true },

  // Address Object
  address: { type: addressSchema, required: true },

  // Additional Fields
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  
  // Availability Status
  available: { type: Boolean, default: true },
}, {
  timestamps: true  // Enables automatic creation of createdAt and updatedAt fields
});

module.exports = mongoose.model('BloodCenterSite', BloodCenterSiteSchema);
