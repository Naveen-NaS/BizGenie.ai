"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { handleCredentialsSignIn, handleCredentialsSignUp, handelResendVerficationCode } from "@/app/actions/authActions";

import { REGEXP_ONLY_DIGITS } from "input-otp";

const OTPSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Button } from "@/components/ui/button";

const VerifyEmail = (username: string, email: string, password: string) => {
  const [countdown, setCountdown] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);

  const [globalMessage, setGlobalMessage] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("none");

  const form = useForm<z.infer<typeof OTPSchema>>({
    resolver: zodResolver(OTPSchema),
    defaultValues: {
      pin: "",
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendEnabled(true);
    }
  }, [countdown]);

  const handleResendClick = () => {
    setCountdown(45);
    setIsResendEnabled(false);
  };

  const onSubmit = async (data: z.infer<typeof OTPSchema>) => {
    try {
      const response: Response = await fetch("/api/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({data}),
      });

      const response_data = await response.json();
      console.log(data);
      if(response.ok) {
        await handleCredentialsSignIn({email, password});
        setGlobalMessage(response_data.message);
        setGlobalSuccess("true");
      } else {
        setGlobalMessage(response_data.message);
        setGlobalSuccess("false");
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.");
      setGlobalMessage("Something went wrong. Please try again.");
      setGlobalSuccess("false");
    }
  }

  return (
    <main className="relative min-h-screen flex flex-col justify-center font-inter">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
        <div className="flex justify-center">
          <div className="max-w-md mx-auto bg-slate-800 text-center px-4 sm:px-8 py-10 rounded-xl shadow">
            <Link href="/" className="ml-2 flex justify-center items-center mb-3">
              <Image
                src="/logo.png"
                alt="Logo"
                width={150}
                height={150}
                className="hover:opacity-80 transition-opacity duration-300"
              />
            </Link>
            <header className="mb-6">
              <h1 className="text-2xl text-slate-50 font-bold mb-1">Email Verification</h1>
              <p className="text-[15px] text-slate-100">
                Enter the 6-digit verification code sent to your Email.
              </p>
            </header>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                      <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
                        <InputOTPGroup>
                          {[0, 1, 2, 3, 4, 5].map((index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className={'text-white border-white text-center w-12 h-12 mx-1 rounded-lg border transition-all duration-200'}
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>

            <button
              className="bg-slate-950 mt-6 relative group/btn w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
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
                  Verify Code & Sign In &rarr;
                  <BottomGradient />
                </>
              )}
            </button>

            <div className="text-l text-slate-200 mt-4">
              Didn't receive code?{' '}
              <button
                onClick={handleResendClick}
                disabled={!isResendEnabled}
                className={`font-bold text-base bg-clip-text ${isResendEnabled ? 'bg-gradient-to-r from-blue-500 to-violet-500' : 'text-gray-400'}`}
              >
                Resend {countdown > 0 ? `in ${countdown}s` : ''}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VerifyEmail;

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-orange-400 to-transparent" />
    </>
  );
};