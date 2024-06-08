import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";


export const authOptions : NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session:{
      strategy: "jwt"
    },
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        authorization: {
          params: {
            scope: "openid email profile https://www.googleapis.com/auth/gmail.readonly",
          },
        },
      })
    ],
    callbacks: {
      async jwt({ token, account }) {
        // console.log(token);
        
        if (account) {
          token.accessToken = account.access_token;
        }
        return token;
      },
      async session({ session, token }) {
        session.user = token
        session.user.image = token.picture
        session.accessToken = token.accessToken as string;
        return session;
      },
    },
}

