/*
alert/incident schema
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create AlertsIncidents Schema
const AlertsIncidentsSchema = new Schema(
    {
        active: {
            type: Boolean,
            default: true
        },
        message: {
            type: String, // above {{threshold}} days
        },
        available: {
            type: Boolean,
            default: true
        },
        request: {
            type: Object,
            required: [true, "request field is required"]
        },
    },
    { 
        timestamps: true,  // Automatically include createdAt and updatedAt fields
        index: { active: 1, available: 1 }  // Compound index on "active" and "available", if needed
    }
);

const AlertsIncidents = mongoose.model("alertsincidents", AlertsIncidentsSchema);

module.exports = AlertsIncidents;
