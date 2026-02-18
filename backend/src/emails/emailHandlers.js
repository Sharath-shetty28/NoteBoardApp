import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(name, to) {
  try {
    await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to,
      subject: "Welcome to KnowledgeFlow AI 🎉",
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #0F172A; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
      <!-- Header -->
      <div style="background: #7480FF; color: white; text-align: center; padding: 20px;">
        <h1 style="margin: 0;">👋 Welcome to KnowledgeFlow AI</h1>
      </div>

      <!-- Body -->
      <div style="padding: 25px; color: #333;">
        <p>Hi ${name},</p>
        <p>We’re super excited to have you onboard 🎉</p>
        <p>With <strong>KnowledgeFlow AI</strong>, you can organize your notes, ideas, and projects all in one place.</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="noteboardapp.onrender.com/login" target="_blank" rel="noopener noreferrer"
             style="background: #7480FF; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
             Get Started
          </a>
        </div>

        <p>If you have any questions, just reply to this email — we’re always happy to help!</p>
        <p>Cheers,<br>The KnowledgeFlow AI Team 🚀</p>
      </div>

      <!-- Footer -->
      <div style="background: #f3f4f6; text-align: center; padding: 15px; font-size: 12px; color: #777;">
        © ${new Date().getFullYear()} KnowledgeFlow AI. All rights reserved.
      </div>
    </div>
  </div>
  `,
    });
  } catch (err) {
    console.error("❌ Failed to send welcome email:", err);
  }
}

export async function sendPasswordResetEmail(to, resetLink) {
  try {
    await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to,
      subject: "Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0F172A; padding: 30px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
    
    <!-- Header -->
    <div style="background: #4F46E5; color: white; text-align: center; padding: 25px;">
      <h1 style="margin: 0; font-size: 24px; font-weight: bold;">KnowledgeFlow AI</h1>
    </div>

    <!-- Body -->
    <div style="padding: 30px; color: #111827; line-height: 1.6;">
      <h2 style="margin-top: 0; color: #111827; font-size: 20px;">Password Reset</h2>
      <p style="margin: 15px 0; font-size: 16px;">
        You requested a password reset. Click the button below to reset your password:
      </p>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 25px 0;">
        <a href="${resetLink}" 
           style="display: inline-block; background: #4F46E5; color: white; text-decoration: none;
                  padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 16px;">
          Reset Password
        </a>
      </div>

      <p style="font-size: 14px; color: #555;">
        If the button doesn’t work, copy and paste this link into your browser:
      </p>
      <p style="word-break: break-all; font-size: 14px; color: #1D4ED8;">
        <a href="${resetLink}" style="color: #1D4ED8;">${resetLink}</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="background: #f9fafb; text-align: center; padding: 18px; font-size: 13px; color: #6B7280;">
      © ${new Date().getFullYear()} <strong>KnowledgeFlow AI</strong>. All rights reserved.
    </div>
  </div>
</div>
      `,
    });
  } catch (err) {
    console.error("❌ Failed to send password reset email:", err);
  }
}
