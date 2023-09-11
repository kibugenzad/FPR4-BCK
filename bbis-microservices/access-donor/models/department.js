const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create department schema
const DepartmentSchema = new Schema(
    {
        available: {
            type: Boolean,
            default: true
        },
        name: {
            type: String,
            required: [true, "name field is required"],
            unique: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        externalID:{
            type: String,
            required: [true, "externalID field is required"],
            unique: true,
            trim: true
        },
        manager: {
            type: Schema.Types.ObjectId,
            ref: "Account",
        },
    },
    { 
        timestamps: true,
        index: {
            name: 1,
        }  
    }
);

// Create the model based on the schema
const Department = mongoose.model("Department", DepartmentSchema);

module.exports = Department;