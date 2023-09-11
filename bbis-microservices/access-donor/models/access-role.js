/*
access role model
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the role schema
const AccessRoleSchema = new Schema({
    available: {
        type: Boolean,
        default: true
    },
    name: String,
    permissions: {
        menus: [String],
        operations: {
            create: [String],
            read: [String],
            update: [String],
            delete: [String]
        }
    }
});


// Create the model based on the schema
const AccessRole = mongoose.model("accessRole", AccessRoleSchema);

module.exports = AccessRole