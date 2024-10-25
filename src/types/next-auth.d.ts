// types/next-auth.d.ts

import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface User {
        id: string
        role: string
    }
    interface Session {
        user: User
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: string
    }
}

// import 'next-auth';
// import { DefaultSession } from 'next-auth';


// declare module 'next-auth' {
//     interface User{
//         _id?: string;
//         isVerified?: boolean;
//         isAcceptingMessages?: boolean;
//         username?: string;
//     }
//     interface Session {
//         user: {
//             _id?: string;
//             isVerified?: boolean;
//             isAcceptingMessages?: boolean;
//             username?: string;
//         } & DefaultSession['user'];
//     }
// }

// declare module 'next-auth/jwt' {
//     interface JWT {
//         _id?: string;
//         isVerified?: boolean;
//         isAcceptingMessages?: boolean;
//         username?: string;
//     }
// }    