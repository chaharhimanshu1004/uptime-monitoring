
import nodemailer from "nodemailer";
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationCode: string
): Promise<ApiResponse> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NEXT_PUBLIC_GMAIL_ID,
      pass: process.env.NEXT_PUBLIC_PASS,
    },
  });
  const mailOptions = {
    from: 'uptime.monitoring.dev@gmail.com',
    to: email,
    subject: "Uptime Monitoring | Verification code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px; border: 1px solid #ddd;">
        <h2 style="color: #333;">Hello ${name},</h2>
        <p style="font-size: 16px; color: #555;">
          Thank you for registering with us! Please use the following verification code to complete your signup process:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 4px; font-size: 18px; font-weight: bold;">
            ${verificationCode}
          </span>
        </div>
        <p style="font-size: 16px; color: #555;">
          If you did not request this email, please ignore it.
        </p>
        <p style="font-size: 16px; color: #555;">
          Regards,<br />
          Uptime Monitoring Team
        </p>
      </div>
    `,
  };
  try {
    await transporter.sendMail(mailOptions);
    return {
      success: true,
      message: "Verifcation email send successfully, check your email!",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
