const schedule = require('node-schedule'); // If you're using node-schedule for scheduling
const preDonationAssessment = require('../../models/pre-donation-assessment');
const account = require('../../models/account');
const eventEmitter = require('../event/eventEmitter');
const SendEmail = require('../utils/send-email');
const Donor = require('../../models/donor');
const generateToken = require('../utils/generateToken');


schedule.scheduleJob("* * * * * *", async () => {
   
});

eventEmitter.on('accountCreated', async (data) => {
    const { email, firstName,password } = data;
    await new SendEmail({ name:firstName, email,message:`${password}` }, null, null).sendWelcome();
});


eventEmitter.on('donorCreated', async (donor) => {
    const token = generateToken({ id: donor._id, account_type: "donor" });
    await new SendEmail({ name:donor.firstName, email:donor.email, message:`Your Donor Number is ${donor.donorNumber} \n\nPlease provide your own credentials to access RBC blood donation account at ${process.env.FRONT_END_LINK}/reset-password/${token} \n\nThank you,\nRBC TEAM`}, null, null).sendDonation();
    // send notification to fill pre-assessment
    await new SendEmail({ name:donor.firstName, email:donor.email, message:`Please fill the pre-assessment form at ${process.env.FRONT_END_LINK}/pre-assessment \n\nThank you,\nRBC TEAM`}, null, null).sendDonation();
});

eventEmitter.on('donationAppointmentCreated', async (data) => {
    const assessment = await preDonationAssessment.findById(data.assessment.id).populate({ path: "center" }).populate({ path: "centerSite" }).populate({ path: "donor" });
    const { requestedDate,center,centerSite,donor } = assessment;
    const formattedDate = new Date(requestedDate).toLocaleDateString('en-CA');
    await new SendEmail({ name:donor.firstName, email:donor.email, message:`Your appointment on ${formattedDate} has been submitted to ${center.name} - ${centerSite.name} \n \n You will receive a confirmation message after review this appointment \n\n Thank you \n RBC TEAM` }, null, null).sendDonation();
});

eventEmitter.on('donationAppointmentApproved', async (data) => {
    const assessment = await preDonationAssessment.findById (data.assessment._id).populate({ path: "center" }).populate({ path: "centerSite" }).populate({ path: "donor" });
    const { requestedDate,center,centerSite,donor } = assessment;
    const formattedDate = new Date(requestedDate).toLocaleDateString('en-CA');
    await new SendEmail({ name:donor.firstName, email:donor.email, message:`Your appointment on ${formattedDate} has been ${assessment.status} by ${center.name} - ${centerSite.name} \n\n Thank you \n RBC TEAM` }, null, null).sendDonation();
});







