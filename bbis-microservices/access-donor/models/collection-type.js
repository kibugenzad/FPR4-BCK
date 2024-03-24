const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CollectionTypeSchema = new Schema(
    {
        available: {
        type: Boolean,
        default: true,
        },
        name: {
        type: String,
        required: [true, "name field is required"],
        unique: true,
        trim: true,
        }
    },
    {
        timestamps: true,
        index: {
        name: 1,
        },
    }
    );

const CollectionType = mongoose.model("CollectionType", CollectionTypeSchema);

module.exports = CollectionType;
