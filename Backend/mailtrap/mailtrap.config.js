const { MailtrapClient } = require("mailtrap");
const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

const TOKEN = process.env.MAILTRAP_API_TOKEN;

const mailTrapClient = new MailtrapClient({
  token: TOKEN, // ✅ only token needed
});

const sender = {
  email: "hello@demomailtrap.co",
  name: "Mailtrap Test",
};

module.exports = { mailTrapClient, sender };