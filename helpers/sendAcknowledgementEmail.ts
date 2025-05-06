import nodemailer from "nodemailer";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendAcknowledgmentEmail(
    websiteUrl: string,
    userEmail: string
): Promise<ApiResponse> {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.NEXT_PUBLIC_GMAIL_ID,
            pass: process.env.NEXT_PUBLIC_PASS,
        },
    });

    const currentDate = new Date().toLocaleString();

    const mailOptions = {
        from: 'uptime.monitoring.dev@gmail.com',
        to: userEmail,
        subject: "Uptime Monitoring | Incident Acknowledgment",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px; border: 1px solid #ddd;">
        <h2 style="color: #333;">Incident Acknowledgment</h2>
        <p style="font-size: 16px; color: #555;">
          This is to confirm that you have acknowledged an incident for the following website:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="display: inline-block; background-color: #3498db; color: white; padding: 10px 20px; border-radius: 4px; font-size: 18px; font-weight: bold;">
            ${websiteUrl}
          </span>
        </div>
        <p style="font-size: 16px; color: #555;">
          Acknowledgment time: ${currentDate}
        </p>
        <p style="font-size: 16px; color: #555;">
          Our team has been notified and is working to resolve the issue. You will receive 
          another notification once the incident has been resolved.
        </p>
        <p style="font-size: 16px; color: #555;">
          If you did not acknowledge this incident, please contact support immediately.
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
            message: "Acknowledgment email sent successfully",
        };
    } catch (err) {
        console.log(err);
        return {
            success: false,
            message: "Failed to send acknowledgment email",
        };
    }
}