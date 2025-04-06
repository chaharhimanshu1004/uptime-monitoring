import nodemailer from "nodemailer";

export async function sendNotificationEmail(url: string, userEmail: string): Promise<void> {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.NODEMAILER_GMAIL as string,
            pass: process.env.NODEMAILER_PASS as string,
        },
    });

    const mailOptions = {
        from: "uptime.monitoring.dev@gmail.com",
        to: userEmail,
        subject: "Website down alert | Uptime Monitoring",
        html: `
            <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); border-radius: 12px; color: #ffffff; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);">
                <h2 style="color: #a78bfa; text-align: center;">🔧 Test Incident Alert</h2>
                <p style="font-size: 16px; line-height: 1.6; text-align: center;">
                This is a <span style="color: #38bdf8; font-weight: bold;">test alert</span> for your website 
                <span style="color: #38bdf8;"><strong>${url}</strong></span>.
                </p>

                <div style="text-align: center; margin: 30px 0;">
                <span style="display: inline-block; background: linear-gradient(to right, #a78bfa, #38bdf8); color: #fff; padding: 12px 24px; border-radius: 8px; font-size: 16px; font-weight: bold;">
                    ✅ No Action Needed
                </span>
                </div>

                <p style="font-size: 15px; line-height: 1.6; color: #d1d5db; text-align: center;">
                Don't worry — everything is running smoothly. This message was sent as part of a routine system test.
                </p>

                <p style="font-size: 15px; line-height: 1.6; color: #d1d5db; text-align: center;">
                No further action is required on your end.
                </p>

                <p style="font-size: 14px; text-align: center; margin-top: 40px; color: #9ca3af;">
                — Uptime Monitor Team
                </p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to: `, userEmail);
    } catch (error: any) {
        console.log(`Error sending email`, error);
        throw new Error(`Error sending email: ${error.message}`);
    }
}