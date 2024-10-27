"use server";

import { signIn, signOut } from "@/auth"
import { signUpSchema } from "@/schemas/signUpSchema";
import { AuthError } from "next-auth";
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";

export async function handleCredentialsSignIn(email: string, password: string): Promise<AuthError | undefined> {
    try {
        await signIn("credentials", {email, password, redirectTo: "/"});
    } catch (error) {
        if(error instanceof AuthError) {
            switch(error.type) {
                case 'CredentialsSignin':
                    return {
                        type: error.type,
                        name: error.name,
                        message: 'Invalid email or password'
                    }
                default:
                    return {
                        type: error.type,
                        name: error.name,
                        message: 'An error occurred'
                    }
            }
        }
        throw error;
    }
}

export async function handleSignOut() {
    await signOut();
}

export async function handleSignUp({ username, email, password, confirmPassword, referralCode}: {
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
    referralCode: string,
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

        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        let verifyCodeExpiry = new Date(Date.now() + 3600000);

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