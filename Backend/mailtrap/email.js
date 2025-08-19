const { mailTrapClient, sender } = require("./mailtrap.config");
const { VERIFICATION_EMAIL_TEMPLATE } = require("./emailTemplate");

module.exports.sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your Email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });

    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};


module.exports.sendWelcomeEmail = async (email,name) => {
    const recipient = [{email}]

    try{
        const response = await mailTrapClient.send({
          from: sender,
          to: recipient,
          template_uuid: "33932cc5-e982-4eb6-8772-782b1a3caca3",
          template_variables: {
            name: name,
            company_info_name: "Sam Auth",
          },
        });

        console.log("Welcome email sent successfully:", response);
    }catch(err){
        console.error("Error sending welcome email:", err);
    }
}