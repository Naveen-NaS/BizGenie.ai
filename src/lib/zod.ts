import { verify } from "crypto";
import { date, object, string } from "zod";

export const signInSchema = object({
  email: string({ required_error: 'Email is required' })
          .min(1, "Email is required")
          .email("Invalid email"),
  password: string({ required_error: 'Password is required' })
          .min(1, "Password is required")
          .min(8, "Password must be at least 8 characters long")
          .max(32, "Password must be at most 32 characters long"),
});

export const signUpSchema = object({
  username: string().min(1, "Username is required"),
  fullname: string().min(1, "Username is required"),
  email: string({ required_error: "Email is required" })
          .min(1, "Email is required.")
          .email("Invalid email"),
  password: string({ required_error: "Password is required" })
          .min(1, "Password is required")
          .min(8, "Password must be more than 8 characters")
          .max(32, "Password must be less than 32 characters"),
  confirmPassword: string({ required_error: "Confirm password is required" })
          .min(1, "Confirm password is required")
          .min(8, "Password must be more than 8 characters")
          .max(32, "Password must be less than 32 characters"),
  referralCode: string().regex(/^\d{5}$/, { message: "Code must be 5 digits" }),
  verifyCode: string(),
  verifyCodeExpiry: date(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
