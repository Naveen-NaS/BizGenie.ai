"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUpSchema } from "@/lib/zod";
import ErrorMessage from "@/components/ErrorMessage";
import { handleCredentialsSignIn, handleSignUp } from "@/app/actions/authActions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

import Image from "next/image";

export default function SignUp() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [username, setUsername] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [globalError, setGlobalError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      referralCode: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    try {
      const result: ServerActionResponse = await handleSignUp(values);
      if (result.success) {
        const valuesForSignin = {
          email: values.email,
          password: values.password,
        };
        setUsername(values.username);
        await handleCredentialsSignIn(values.email, values.password);
        setIsSuccess(true);
      } else {
        setGlobalError(result.message);
      }
    } catch (error) {
      setGlobalError("An unexpected error occurred. Please try again.");
    }
  };

  const verifyEmailCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, verifyCode }),
      });

      const data = await response.json();
    } catch (error) {
      console.log("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="h-[100vh] overflow-y-auto">
      <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10">
        {!isSuccess ? (
          <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-6 shadow-input bg-slate-800 dark:bg-black">
            <h1 className="font-bold text-2xl md:text-3xl text-neutral-200 dark:text-neutral-200 text-center md:text-left flex items-center">
              Welcome to{""}
              <Link href="/" className="ml-2 flex items-center">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={150}
                  height={150}
                  className="hover:opacity-80 transition-opacity duration-300"
                />
              </Link>
            </h1>
            <p className="text-neutral-100 text-sm max-w-sm mt-2 dark:text-neutral-300 text-center md:text-left">
              Enter your details to create an account
            </p>

            <form className="my-8" onSubmit={handleSubmit(onSubmit)}>

              <LabelInputContainer className="mb-4">
                <Label htmlFor="email" className="text-neutral-200 mb-1.5">
                  Email Address
                </Label>
                <Input
                  id="email"
                  placeholder="test@gmail.com"
                  type="email"
                  className="bg-gray-700 text-neutral-200"
                  {...register("email")}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </LabelInputContainer>

              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-2">
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="username" className="text-neutral-200 mb-1.5">
                    Username
                  </Label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    type="text"
                    className="bg-gray-700 text-neutral-200"
                    {...register("username")}
                  />
                  {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                </LabelInputContainer>
                <LabelInputContainer className="mb-4 relative">
                  <Label htmlFor="referralcode" className="text-neutral-200 mb-1.5">
                    Referral Code
                  </Label>
                  <div className="relative">
                    <Input
                      id="referralcode"
                      placeholder="Enter referral code"
                      type="text"
                      className="bg-gray-700 text-neutral-200"
                      {...register("referralCode")}
                    />
                    <Link href="/forum">
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                        <HelpCircle className="text-white" />
                        <span
                          className="tooltip absolute text-xs text-white p-3 rounded-md"
                          onMouseEnter={(e) => {
                            const targetElement = e.currentTarget;
                            const rect = (targetElement as HTMLElement).getBoundingClientRect();
                            const tooltip = document.createElement("div");
                            tooltip.innerText = "Fill the forum to get code";
                            tooltip.className =
                              "absolute text-xs p-0.5 text-neutral-200 bg-gray-900 rounded-md";
                              tooltip.style.top = `${rect.top - 25}px`;
                              tooltip.style.left = `${rect.left - 50}px`;
                              
                            document.body.appendChild(tooltip);
                            targetElement.onmouseleave = () => {
                              document.body.removeChild(tooltip);
                            };
                          }}
                        />
                      </span>
                    </Link>
                  </div>
                  {errors.referralCode && <p className="text-red-500 text-sm">{errors.referralCode.message}</p>}
                </LabelInputContainer>
              </div>

              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                <LabelInputContainer>
                  <Label htmlFor="password" className="text-neutral-200 mb-1.5">
                    Password
                  </Label>
                  <Input
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    className="bg-gray-700 text-neutral-200"
                    {...register("password")}
                  />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="confirmPassword" className="text-neutral-200 mb-1.5">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    placeholder="Re-enter Password"
                    type="text"
                    className="bg-gray-700 text-neutral-200"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                </LabelInputContainer>
              </div>


              <button
                className="bg-slate-950 relative group/btn w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                type="submit"
              >
                Sign up &rarr;
                <BottomGradient />
              </button>

              <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-4 h-[1px] w-full" />

              <div className="flex justify-center -mb-10">
                <p className="text-neutral-100 text-l max-w-sm dark:text-neutral-300">
                  Already registered?{" "}
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
                    <Link href="/sign-in">Sign-In</Link>
                  </span>
                </p>
              </div>
            </form>
          </div>
        ) : (
          <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-6 shadow-input bg-slate-800 dark:bg-black">
            <h1 className="font-bold text-2xl md:text-3xl text-neutral-200 dark:text-neutral-200 text-center md:text-left">
              Verify{" "}
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Email
              </span>
            </h1>
            <p className="text-neutral-100 text-sm max-w-sm mt-2 dark:text-neutral-300 text-center md:text-left">
              We have sent a verification code to your email address. Please enter the code to verify your account.
            </p>

            <form className="my-8" onSubmit={verifyEmailCode}>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="verifycode" className="text-neutral-200 mb-1.5">
                  Verification Code
                </Label>
                <Input
                  id="verifycode"
                  placeholder="Enter code"
                  type="verifycode"
                  className="bg-gray-700 text-neutral-200"
                  value={verifyCode}
                  onChange={(e) => {
                    setVerifyCode(e.target.value);
                  }}
                  required
                />
              </LabelInputContainer>

              <button
                className="bg-slate-950 relative group/btn w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                type="submit"
              >
                Verify &rarr;
                <BottomGradient />
              </button>

              <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-4 h-[1px] w-full" />

              <div className="flex justify-center -mb-10">
                <p className="text-neutral-100 text-l max-w-sm dark:text-neutral-300">
                  Didn't receive an email?{" "}
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
                    Resend Code
                  </span>
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

const LabelInputContainer: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => {
    return (
      <div className={cn("flex flex-col w-full", className)}>
        {children}
      </div>
    );
  };
  
  
  const BottomGradient = () => {
    return (
      <>
        <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
        <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-orange-400 to-transparent" />
      </>
    );
  };
