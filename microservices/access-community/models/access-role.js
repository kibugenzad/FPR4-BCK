/*
access role model
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the role schema
const AccessRoleSchema = new Schema({
  available: {
    type: Boolean,
    default: true,
  },
  name: String,
  permissions: {
    type: Array,
  },
  community: {
    type: Schema.Types.ObjectId,
    ref: "Communities",
  },
  default: {
    type: Boolean,
    default: false,
  },
});

// Create the model based on the schema
const AccessRole = mongoose.model("accessRole", AccessRoleSchema);

module.exports = AccessRole;
