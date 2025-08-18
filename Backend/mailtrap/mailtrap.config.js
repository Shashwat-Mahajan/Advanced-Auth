const { MailtrapClient } = require("mailtrap");
const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

const TOKEN = process.env.MAILTRAP_API_TOKEN;

const client = new MailtrapClient({
  token: TOKEN, // ✅ only token needed
});

const sender = {
  email: "hello@demomailtrap.co",
  name: "Mailtrap Test",
};

const recipients = [
  {
    email: "mahajanshashwat542@gmail.com",
  },
];

// ✅ Test runner
(async () => {
  try {
    const response = await client.send({
      from: sender,
      to: recipients,
      subject: "Test Email from mailtrap.config.js",
      text: "If you see this, Mailtrap setup is working!",
      category: "Integration Test",
    });

    console.log("✅ Email sent successfully:", response);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
})();
