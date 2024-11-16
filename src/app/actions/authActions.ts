"use server";

import { signIn, signOut } from "@/auth"
import { signUpSchema } from "@/schemas/signUpSchema";
import { AuthError } from "next-auth";
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

import { CustomError } from '@/utils/CustomError';

import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";

export async function handleCredentialsSignIn({ email, password }: {
    email: string,
    password: string,
}): Promise<AuthError | undefined> {
    try {
        await signIn("credentials", {email, password, redirectTo: "/"});
    } catch (error) {
        if(error instanceof AuthError) {
            switch(error.type) {
                case 'CredentialsSignin':
                    return {
                        type: error.type,
                        name: error.name,
                        message: 'Incorrect email or password'
                    }
                case 'CallbackRouteError':
                    return {
                        type: error.type,
                        name: error.name,
                        message: 'Email is not verified, Please Sign-Up again.'
                    }
                default:
                    return {
                        type: error.type,
                        name: error.name,
                        message: 'An unknown error occurred, please try again later'
                    }
            }
        }
        throw error;
    }
}

export async function handleSignOut() {
    await signOut();
}

export async function handleCredentialsSignUp({ username, fullname, email, password, confirmPassword, referralCode, verifyCode, verifyCodeExpiry}: {
    username: string,
    fullname: string,
    email: string,
    password: string,
    confirmPassword: string,
    referralCode: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
}) {
    try {
        if (referralCode !== process.env.REFERRAL_CODE) {
            return { success: false, message: "Invalid Referral Code." };
        }


        const existingUserByEmail = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        const existingUsername = await prisma.user.findUnique({
            where: {
                username,
            },
        });

        if (existingUsername) {
            return { success: false, message: "Username already exists. Please choose another." };
        }

        if (existingUserByEmail) {
            if(existingUserByEmail.isEmailVerified) {
                return { success: false, message: "Email already in use. Please sign in." };
            } else {
                const hashedPassword = await bcryptjs.hash(password, 10);
                await prisma.user.update({
                    where: {
                        email,
                    },
                    data: {
                        password: hashedPassword,
                        emailVerifyCode: verifyCode,
                        verifyCodeExpiry,
                    },
                });
            }
        } else {
            const hashedPassword = await bcryptjs.hash(password, 10);
            await prisma.user.create({
                data: {
                    username,
                    fullname,
                    email,
                    password: hashedPassword,
                    emailVerifyCode: verifyCode,
                    verifyCodeExpiry,
                },
            });
        }

        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );
        if (!emailResponse.success) {
            console.error("Error sending email:", emailResponse.message);
            return { success: false, message: emailResponse.message}
        }

        return { success: true, message: "Account created successfully." };
    } catch (error) {
        console.error("Error creating account:", error);
        return { success: false, message: "An unexpected error occurred. Please try again." };
    }
}

export async function handelResendVerficationCode(email: string) {
    try {
        const existingUserByEmail = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!existingUserByEmail) {
            return { success: false, message: "Email not found." };
        }

        if (existingUserByEmail.isEmailVerified) {
            return { success: false, message: "Email already verified." };
        }

        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        let verifyCodeExpiry = new Date(Date.now() + 3600000);

        await prisma.user.update({
            where: {
                email,
            },
            data: {
                emailVerifyCode: verifyCode,
                verifyCodeExpiry,
            },
        });

        const emailResponse = await sendVerificationEmail(
            email,
            existingUserByEmail.username,
            verifyCode
        );
        if (!emailResponse.success) {
            console.error("Error sending email:", emailResponse.message);
            return { success: false, message: emailResponse.message}
        }

        return { success: true, message: "Verification code resent." };
    } catch (error) {
        console.error("Error resending verification code:", error);
        return { success: false, message: "An unexpected error occurred. Please try again."};
    }
}