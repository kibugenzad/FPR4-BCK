const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Address sub-schema
const addressSchema = new Schema({
  province: { type: String, required: true },
  district: { type: String, required: true },
  sector: { type: String, required: true },
  cell: { type: String, required: true },
  village: { type: String, required: true },
}, {
  _id: false // This line ensures that no additional ID is created for this sub-document
});

// Main BloodCenter schema
const BloodCenterSchema = new Schema({
  // ID linking to the Position schema for blood center leader
  centerLeader: { type: Schema.Types.ObjectId, ref: 'Position', required: true },

  // Center Name
  name: { type: String, required: true },

  // Center Code
  code: { type: String, required: true, unique: true },

  // Address Object
  address: { type: addressSchema, required: true },

  // Additional Fields
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  available: { type: Boolean, default: true },
  
}, {
  timestamps: true  // Enables automatic creation of createdAt and updatedAt fields
});

module.exports = mongoose.model('BloodCenter', BloodCenterSchema);
