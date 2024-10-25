import {z} from 'zod';

export const usernameValidation = z
    .string()
    .min(4, "Username must be atleast 4 characters")
    .max(20, "Username must be atmost 20 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Username can only contain alphabets and numbers");


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "Password must be atleast 6 characters"}),
    verifyCode: z.string().min(6, {message: "Verify Code must be atleast 6 characters"})
})