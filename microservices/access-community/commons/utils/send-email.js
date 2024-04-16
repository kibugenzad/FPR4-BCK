const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
require("dotenv").config();

const emailTransport = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

class SendEmail {
  constructor(obj, url, randomAuth) {
    this.to = obj.email;
    this.name = obj.name;
    this.url = url;
    this.images = obj.images;
    this.message = obj.message;
    this.type = obj.type;
    this.from = `FPR <${process.env.EMAIL_FROM}>`;
  }

  // Send the  email using email
  async send(template, subject) {
    try {
      const html = await ejs.renderFile(
        path.join(__dirname, `../emailTemplate/${template}.ejs`),
        {
          name: this.name,
          url: this.url,
          message: this.message,
        }
      );

      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: html,
      };

      await emailTransport().sendMail(mailOptions);
    } catch (err) {
      console.log("err", err);
    }
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to FPR Inkotanyi Community");
  }

  async sendPasswordReset() {
    await this.send("passwordReset", "Password Reset");
  }

  async sendDonation() {
    await this.send("donation", "Donation");
  }

  async donationAppointment() {
    await this.send("donationAppointment", "Donation Appointment Scheduled");
  }
}

module.exports = SendEmail;
