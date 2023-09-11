const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Service schema
const ServiceSchema = new Schema(
    {
        available: {
            type: Boolean,
            default: true
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "ServiceCategory",
            required: [true, "category field is required"]
        },
        description: {
            type: String,
            trim: true
        },
        files:{
            type: Array,
        },
        institution:{
            type: String,
            required: [true, "Institution field is required"],
            unique: true,
            trim: true
        },
        approver: [{
            ippsNumber: {
                type: String,
                required: [true, "ippsNumber field is required"],
                unique: true,
                trim: true
            },
            position: {
                type: Schema.Types.ObjectId,
                ref: "Position",
                required: [true, "position field is required"]
            },
        }]
    },
    { 
        timestamps: true,
        index: {
            name: 1,
        }  
    }
);

// Create the model based on the schema
const Service = mongoose.model("Service", ServiceSchema);

module.exports = Service;