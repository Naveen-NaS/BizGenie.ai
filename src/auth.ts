import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";

import { CustomError } from '@/utils/CustomError';

import { CredentialsSignin } from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any, req): Promise<any> {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          throw new CredentialsSignin("Invalid credentials");
        }
      
        if (!user.isEmailVerified) {
          throw new Error("Email is not verified, Please Sign-Up again.");
        }
      
        const isPasswordValid = await bcryptjs.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new CredentialsSignin("Invalid password.");
        }
      
        return user;

        // if (!user) {
        //   throw new CustomError('No user found with this email.');
        //   // throw new Error('No user found with this email.');
        //   // return { success: false, message: "No user found with this email." };
        // }

        // if (!user.isEmailVerified) {
        //   throw new Error('Email is not verified, Please Sign-Up again.');
        // }

        // const isPasswordValid = await bcryptjs.compare(credentials.password, user.password);

        // if (isPasswordValid) {
        //   return user;
        // } else {
        //   throw new Error('Invalid password');
        // }
      },
    }),
  ],
  pages: {
    signIn: '/auth/sign-in',
  },
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        token.id = user.id as string
        token.email = user.email as string
        token.fullname = user.fullname as string
        token.username = user.username as string
        token.image = user.image ? user.image as string : undefined
        token.role = user.role as string
      }
      return token
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        fullname: token.fullname,
        username: token.username,
        image: token.image,
        role: token.role,
      }
      return session
    }
  },
  secret: process.env.AUTH_SECRET,
})

// callbacks: {
//   authorized({request: {nextUrl}, auth}) {
//     const isLoggedIn = !!auth?.user;
//     const { pathname } = nextUrl;
//     if(pathname.startsWith('/sign-in') && isLoggedIn) {
//       return Response.redirect(new URL('/', nextUrl));
//     }

//     return !!auth;
//   }
// },

// authorized({request: {nextUrl}, auth}) {
//   const isLoggedIn = !!auth?.user;
//   const { pathname } = nextUrl;
//   if(pathname.startsWith('/auth/sign-in') && isLoggedIn) {
//     return Response.redirect(new URL('/', nextUrl));
//   }

//   return !!auth;
// },