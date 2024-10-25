import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
// import { SignInWithEmailAndPassword } from "./app/actions/user/user.actions"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any, req): Promise<any> {
        // await dbConnect();
        // const user = await SignInWithEmailAndPassword(credentials); // User verification logic
        // if (user.status === 400) {
        //   return null;
        // }
        // return user.data;
      },
    }),
  ],
  pages: {
    signIn: '/sign-in',
  },
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