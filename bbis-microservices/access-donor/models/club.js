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
    }
  },
  {
    timestamps: true, 
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// Club has many members
ClubSchema.virtual("members", {
  ref: "ClubMember",
  localField: "_id",
  foreignField: "club",
  justOne: false,

});

module.exports = mongoose.model("Club", ClubSchema);