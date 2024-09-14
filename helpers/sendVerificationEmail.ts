
import { resend } from "@/lib/resend";

import VerificationEmail from "@/emails/verificationEmails";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(email: string, name: string, verificationCode: string):Promise<ApiResponse> {
    try{
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Uptime Monitoring | Verification code',
            react: VerificationEmail({ name, otp: verificationCode }),
          });
        return {
            success: true,
            message: "Verifcation email send successfully, check your email!"
        }
    }catch(err){
        console.error("Error in sending email", err);
        return {
            success: false,
            message: "Failed to send verification email"
        }
    }
};

    