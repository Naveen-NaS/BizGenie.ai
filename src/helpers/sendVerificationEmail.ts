import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(email: string, username: string, verificationCode: string) {
    try {
        resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'BizGennie AI | Verification Code',
            react: VerificationEmail({username, otp: verificationCode}),
        });

        return {
            success: true,
            message: "Verification email sent successfully.",
        };
    } catch (emailError) {
        console.error("Error sending verification email.", emailError);
        
        return {
            success: false,
            message: "Error sending verification email.",
        };
    }
}
