import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import GoogleProvider from "next-auth/providers/google";
import { InvalidLogin, AccountNull } from "@/utils/Errors/AuthErrors";
import prisma from "@/prisma/client";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      const { user } = session;
      const { email } = user;
      // Additional Logic
      const FoundUser = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      // Return to Server Sesssion
      return FoundUser;
    },
    async signIn({ user, profile, account }) {
      // console.log(user, profile, account);
      const { provider } = account;
      const { email } = user;
      // Check if Account exists via email

      // Account Exist
      // OAuth Users
      const FoundUser = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      // return true;

      // Non-OAuth Users
      // Validate Password

      // Wrong credentials
      // InvalidLogin();

      // Correct credentials
      // return true;

      // Account doesn't exist
      // OAuth Users
      // Create Account

      // Non-OAuth Users
      // AccountNull();

      return true;
    },
  },
  pages: {
    // signIn: '/auth/signin',
    // signOut: '/auth/signout',
    error: "/", // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
};

export async function logOutRequiredServer() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/chats");
}

export async function loginIsRequiredServer() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
}

export function loginIsRequiredClient() {
  if (typeof window !== undefined) {
    const session = useSession();
    const router = useRouter();
    if (!session.data && session.status !== "loading") router.push("/");
  }
}
