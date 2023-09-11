const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Main PreDonationAssessment schema
const PreDonationAssessmentSchema = new Schema({
  // Weight in kilograms
  weight: { type: Number, required: true },
  
  // Temperature in Celsius
  temperature: { type: Number, required: true },

  // Blood Pressure (systolic and diastolic)
  bloodPressure: {
    systolic: { type: Number, required: true },
    diastolic: { type: Number, required: true }
  },
  
  // Pulse rate in beats per minute
  pulseRate: { type: Number, required: true },
  
  // Hemoglobin level in g/dL
  hemoglobinLevel: { type: Number, required: true },
  
  // Health questionnaire results (example)
  healthQuestionnaire: {
    recentIllness: { type: Boolean, required: true },
    recentMedication: { type: Boolean, required: true },
    recentSurgery: { type: Boolean, required: true },
    // Add more as needed
  },
  
  // Eligibility status, computed based on the above information
  isEligible: { type: Boolean, default: false },
  
  // Any other remarks or considerations
  remarks: { type: String },

  // The ID of the assessor or health professional
  assessedBy: { type: Schema.Types.ObjectId, ref: 'Account', required: true }

}, {
  timestamps: true  // Enables automatic creation of createdAt and updatedAt fields
});

module.exports = mongoose.model('PreDonationAssessment', PreDonationAssessmentSchema);
