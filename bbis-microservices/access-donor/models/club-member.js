const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the club-member schema
const ClubMemberSchema = new Schema(
  {
    donor: {
      type: Schema.Types.ObjectId,
      ref: "Donor",
    },
    club: {
      type: Schema.Types.ObjectId,
      ref: "Club",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, 
  }
);



module.exports = mongoose.model("ClubMember", ClubMemberSchema);
