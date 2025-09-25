import nodemailer from "nodemailer";

// export async function sendWelcomeEmail(to) {
//   const transporter = nodemailer.createTransport({
//     host: process.env.BREVO_HOST,
//     port: process.env.BREVO_PORT,
//     auth: {
//       user: process.env.BREVO_USER,
//       pass: process.env.BREVO_PASS,
//     },
//   });

//   try {
//     await transporter.sendMail({
//       from: '"NoteBoardApp" <anuguru8888@gmail.com>',
//       to,
//       subject: "Welcome to NoteBoardApp 🎉",
//       html: `
//       <div style="font-family: Arial, sans-serif; background-color: #0F172A; padding: 30px;">
//     <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">

//       <!-- Header -->
//       <div style="background: #7480FF; color: white; text-align: center; padding: 20px;">
//         <h1 style="margin: 0;">👋 Welcome to NoteBoardApp</h1>
//       </div>

//       <!-- Body -->
//       <div style="padding: 25px; color: #333;">
//         <p>Hi there,</p>
//         <p>We’re super excited to have you onboard 🎉</p>
//         <p>With <strong>NoteBoardApp</strong>, you can organize your notes, ideas, and projects all in one place.</p>

//         <div style="text-align: center; margin: 30px 0;">
//           <a href="noteboardapp.onrender.com/login" target="_blank" rel="noopener noreferrer"
//              style="background: #7480FF; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
//              Get Started
//           </a>
//         </div>

//         <p>If you have any questions, just reply to this email — we’re always happy to help!</p>
//         <p>Cheers,<br>The NoteBoardApp Team 🚀</p>
//       </div>

//       <!-- Footer -->
//       <div style="background: #f3f4f6; text-align: center; padding: 15px; font-size: 12px; color: #777;">
//         © ${new Date().getFullYear()} NoteBoardApp. All rights reserved.
//       </div>
//     </div>
//   </div>
//   `,
//     });
//   } catch (err) {
//     console.error("❌ Failed to send welcome email:", err);
//   }
// }

import SibApiV3Sdk from "sib-api-v3-sdk";

// Configure API key
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

// Create transactional email instance
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export async function sendWelcomeEmail(toEmail, userName) {
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail({
    to: [{ email: toEmail, name: userName }],
    sender: { email: process.env.FROM_EMAIL, name: "NotesBoardApp" },
    subject: "Welcome to NotesBoardApp!",
    htmlContent: `<html><body><h1>Hello ${userName}, welcome to NotesBoardApp!</h1></body></html>`,
  });

  try {
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
