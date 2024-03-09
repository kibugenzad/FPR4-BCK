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
    await new SendEmail({ name:donorData.firstName, email:"teerenzo.co@gmail.com", message:"Thank you, your are a saver of lifes" }, null, null).sendDonation();
}
);



