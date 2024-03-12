const Model = require("../../models/club-member");
const DonorModel = require("../../models/donor");
const ClubModel = require("../../models/club");

const isAlreadyClubMember = async (req, res, next) => {
    const { donor, club } = req.body;
    const clubMember
        = await Model.findOne({ donor, club });
     const donorInfo = await DonorModel.findById(donor);
    const clubInfo = await ClubModel.findById(club);
    if (!donorInfo) {
        return res.status(404).json({ error: "Donor not found" });
    }
    
    if (!clubInfo) {
        return res.status(404).json({ error: "Club not found" });
    }
    
    if (clubMember) {
        return res.status(403).json({ error: "Donor is already a member of this club" });
    } else {
        next();
    }
}

module.exports = isAlreadyClubMember;