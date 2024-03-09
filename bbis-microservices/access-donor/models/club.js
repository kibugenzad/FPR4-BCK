const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Define the club schema
const ClubSchema = new Schema(
  {
    available: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      required: [true, "Club name is required"],
      unique: true,
    },
    donationNumber: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: [true, "Club description is required"],
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "Donor",
      },
    ],
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Club", ClubSchema);