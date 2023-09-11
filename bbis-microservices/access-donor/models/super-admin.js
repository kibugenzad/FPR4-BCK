/*
account model
*/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create account schema
const SuperAdminSchema = new Schema(
    {
        available: {
            type: Boolean,
            default: true
        },
        email: {
            type: String,
            required: [true, "Email field is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Password field is required"]
        },
        passcode: {
            type: String,
            default: null
        },
        username: {
            type: String,
            unique: true,
            trim: true
        },
    },
    { 
        timestamps: true,
        // Add index to commonly queried fields
        index: {
            email: 1,
            username: 1,
        }  
    }
);


// Pre-save hook
SuperAdminSchema.pre("save", async function(next) {
    const existing = await this.constructor.findOne({});
    if (existing) {
        throw new Error("Super-admin already exists.");
    }
    next();
});

// Create the model based on the schema
const SuperAdmin = mongoose.model("SuperAdmin", SuperAdminSchema);

module.exports = SuperAdmin;
