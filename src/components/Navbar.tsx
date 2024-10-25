"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { handleSignOut } from "@/app/actions/authActions";

import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconBrowser,
} from "@tabler/icons-react";

const Navbar: React.FC = async () => {
  const session = await auth();
  console.log({ session });
  const [scrolled, setScrolled] = useState(false);

  const links = [
    {
      title: "Github",
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://github.com/Naveen-NaS",
    },
    {
      title: "Linkedin",
      icon: (
        <IconBrandLinkedin className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://www.linkedin.com/in/naveen-sharma-871b7a257/",
    },
    {
      title: "Leetcode",
      icon: (
        <Image
          src="/leetcode.png"
          width={20}
          height={20}
          alt="Leetcode Logo"
        />
      ),
      href: "https://leetcode.com/u/Naveen-NaS/",
    },
    {
      title: "Kaggle",
      icon: (
        <Image
          src="/kaggle.png"
          width={20}
          height={20}
          alt="Kaggle Logo"
        />
      ),
      href: "https://www.kaggle.com/naveennas",
    },
    {
      title: "Twitter",
      icon: (
        <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://x.com/NSharma_NaS",
    },
    {
      title: "Portfolio",
      icon: (
        <IconBrowser className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 bg-transparent ${
        scrolled ? "backdrop-blur-md" : ""
      } transition-all duration-300`}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-6 flex-wrap">
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              className="hover:opacity-80 transition-opacity duration-300"
              width={150}
              height={150}
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Link>
        </div>

        <FloatingDock items={links} />

        <div className="flex items-center space-x-4">
          {!session ? (
            <>
              <Link href="/sign-in">
              <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-orange-400 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 text-white hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-200 dark:focus:ring-red-400">
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0">
                    Sign In
                    </span>
              </button>
              </Link>
            </>
          ) : (
            <>
              <form action={handleSignOut}>
                <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-orange-400 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 text-white hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-200 dark:focus:ring-red-400">
                      <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Sign Out
                      </span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
