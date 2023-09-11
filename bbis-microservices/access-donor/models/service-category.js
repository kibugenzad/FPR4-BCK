const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create ServiceCategory schema
const ServiceCategorySchema = new Schema(
    {
        available: {
            type: Boolean,
            default: true
        },
        description: {
            type: String,
            trim: true
        },
        name:{
            type: String,
            required: [true, "name field is required"],
            unique: true,
            trim: true
        },
        type:{ // individual or institutional
            type: String,
            required: [true, "type field is required"],
            unique: true,
            trim: true
        }
    },
    { 
        timestamps: true,
        index: {
            name: 1,
        }  
    }
);

// Create the model based on the schema
const ServiceCategory = mongoose.model("ServiceCategory", ServiceCategorySchema);

module.exports = ServiceCategory;