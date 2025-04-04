import nodeMailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendMail = async (email, subject, htmlContent) => {
  try {
    const transporter = nodeMailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("✅ Mail transporter configured successfully");

    const mailOptions = {
      from: `"Expense Tracker App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully to:", email);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, message: "Email sending failed" };
  }
};

export default sendMail;
