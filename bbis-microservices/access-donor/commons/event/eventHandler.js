const schedule = require('node-schedule'); // If you're using node-schedule for scheduling
const preDonationAssessment = require('../../models/pre-donation-assessment');
const account = require('../../models/account');
const eventEmitter = require('../event/eventEmitter');
const SendEmail = require('../utils/send-email');
const Donor = require('../../models/donor');


schedule.scheduleJob("* * * * * *", async () => {
   
});

eventEmitter.on('accountCreated', async (data) => {
    const { email, firstName,password } = data;
    await new SendEmail({ name:firstName, email,message:`${password}` }, null, null).sendWelcome();
});


eventEmitter.on('donationCreated', async (data) => {
    const { donor } = data;
    const donorData = await Donor.findById(donor);
    await new SendEmail({ name:donorData.firstName, email:donorData.email, message:"Thank you, your are a saver of lifes" }, null, null).sendDonation();
});

eventEmitter.on('donationAppointmentCreated', async (data) => {
    console.log("data", data)
    const assessment = await preDonationAssessment.findById(data.assessment.id).populate({ path: "center" }).populate({ path: "centerSite" }).populate({ path: "donor" });
    const { requestedDate,center,centerSite,donor } = assessment;
    console.log("Donor", assessment)
    await new SendEmail({ name:donor.firstName, email:donor.email, message:`Your appointment on ${requestedDate} has been submitted to ${center.name} - ${centerSite.name} \n You will receive a confirmation message after review this appointment \n Thank you \n RBC TEAM` }, null, null).sendDonation();
});







