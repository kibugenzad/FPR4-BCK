const Model = require("../../models/donor");

const checkIsDonorBlocked = async (req, res, next) => {
    const donorId = req.body.donor;

    const donor = await Model.findById(donorId);
    console.log("Donor: ", donor);
    if(!donor) {
        return res.status(404).json({ error: "Donor not found" });
    }else{
    if (donor.isBlocked) {
        return res.status(403).json({ error: "We are unfortunately unable to book an appointment for you, please consult the nearest BTD center for notification" });
    }else{
        next();

    }
}

 
};

module.exports = checkIsDonorBlocked;