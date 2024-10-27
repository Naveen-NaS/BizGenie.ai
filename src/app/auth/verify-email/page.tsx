"use client"

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const VerifyEmail = () => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { key } = e;
      if (
        !/^[0-9]$/.test(key) &&
        key !== 'Backspace' &&
        key !== 'Delete' &&
        key !== 'Tab' &&
        !e.metaKey
      ) {
        e.preventDefault();
      }

      if (key === 'Delete' || key === 'Backspace') {
        const index = inputsRef.current.indexOf(e.target as HTMLInputElement);
        if (index > 0) {
          inputsRef.current[index - 1]!.value = '';
          inputsRef.current[index - 1]!.focus();
        }
      }
    };

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const index = inputsRef.current.indexOf(target);
      if (target.value && index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1]!.focus();
      }
    };

    const handleFocus = (e: FocusEvent) => {
      (e.target as HTMLInputElement).select();
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData?.getData('text');
      if (text && /^[0-9]{4}$/.test(text)) {
        text.split('').forEach((char, i) => {
          if (inputsRef.current[i]) inputsRef.current[i]!.value = char;
        });
      }
    };

    inputsRef.current.forEach((input) => {
      input?.addEventListener('input', handleInput);
      input?.addEventListener('keydown', handleKeyDown);
      input?.addEventListener('focus', handleFocus);
      input?.addEventListener('paste', handlePaste);
    });

    return () => {
      inputsRef.current.forEach((input) => {
        input?.removeEventListener('input', handleInput);
        input?.removeEventListener('keydown', handleKeyDown);
        input?.removeEventListener('focus', handleFocus);
        input?.removeEventListener('paste', handlePaste);
      });
    };
  }, []);

  return (
    <main className="relative min-h-screen flex flex-col justify-center font-inter">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
        <div className="flex  justify-center">
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
            <header className="mb-8">
              <h1 className="text-2xl text-slate-50 font-bold mb-1">Email Verification</h1>
              <p className="text-[15px] text-slate-100">
                Enter the 6-digit verification code that was sent to your Email.
              </p>
            </header>
            <form>
              <div className="flex items-center justify-center gap-3">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputsRef.current[i] = el;
                    }}
                    type="text"
                    className="w-14 h-14 text-center text-2xl font-extrabold text-slate-50 bg-slate-600 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-slate-800 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    maxLength={1}
                  />
                ))}
              </div>
              <div className="max-w-[260px] mx-auto mt-4">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 transition-colors duration-150"
                >
                  Verify Account
                </button>
              </div>
            </form>
            <div className="text-sm text-slate-200 mt-4">
              Didn't receive code?{' '}
              <a className="font-medium text-indigo-500 hover:text-indigo-600" href="#0">
                Resend
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VerifyEmail;
