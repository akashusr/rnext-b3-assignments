// Load environment variables
require("dotenv").config();

const { sendPasswordResetEmail } = require("./lib/mailer");

async function testEmail() {
  try {
    console.log("Testing email functionality...");
    console.log("Environment check:");
    console.log("- SENDGRID_API_KEY present:", !!process.env.SENDGRID_API_KEY);
    console.log("- EMAIL_FROM:", process.env.EMAIL_FROM);
    console.log("- EMAIL_DEBUG:", process.env.EMAIL_DEBUG);

    const result = await sendPasswordResetEmail({
      to: "test@example.com",
      token: "test-token-123",
    });
    console.log("Email test result:", result);
  } catch (error) {
    console.error("Email test error:", error.message);
    if (error.response && error.response.body) {
      console.error("SendGrid error details:", error.response.body);
    }
  }
}

testEmail();
