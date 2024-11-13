"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";


import { z } from "zod";
import { signUpSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleCredentialsSignUp } from "@/app/actions/authActions";


import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";


import GlobalMessage from "@/components/GlobalMessage";
import VerifyEmail from "@/components/EmailVerification";


export default function SignUp() {
  const [isSuccess, setIsSuccess] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [globalMessage, setGlobalMessage] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("none");

  // Sign-up form logic
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
      verifyCode: Math.floor(100000 + Math.random() * 900000).toString(),
      verifyCodeExpiry: new Date(Date.now() + 3600000),
    },
  });


  // Sign-up submit logic
  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    try {
      console.log("Values: ", values);
      const result: ServerActionResponse = await handleCredentialsSignUp(values);
      if (result.success) {
        setUsername(values.username);
        setPassword(values.password);
        setEmail(values.email);
        setIsSuccess(true);
        setGlobalMessage(result.message);
        setGlobalSuccess("true");
        console.log("result");
      } else {
        console.log(result.message);
        setGlobalMessage(result.message);
        setGlobalSuccess("false");
      }
    } catch (error) {
      console.error(error);
      setGlobalSuccess("false");
      setGlobalMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="h-[100vh] overflow-y-auto">
      <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10">
        {!isSuccess ? (
          <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-6 shadow-input bg-slate-800 ">
            {globalMessage && <GlobalMessage success={globalSuccess} message={globalMessage} />}
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
                {isSubmitting ? (
                  <>
                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
                    </svg>
                    Loading...
                  </>
                ) : (
                  <>
                    Sign up &rarr;
                    <BottomGradient />
                  </>
                )}
              </button>


              <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-4 h-[1px] w-full" />

              <div className="flex justify-center -mb-10">
                <p className="text-neutral-100 text-l max-w-sm dark:text-neutral-300">
                  Already registered?{" "}
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
                    <Link href="/auth/sign-in">Sign-In</Link>
                  </span>
                </p>
              </div>
            </form>
          </div>
        ) : (
          <VerifyEmail username={username} email={email} password={password} />
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
