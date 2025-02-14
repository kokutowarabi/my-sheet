// @/lib/auth-options.ts
import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import createUser from "@/actions/create/create-user";
import createSheet from "@/actions/create/create-sheet";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user }): Promise<boolean> {
      const isNewUser = await createUser({ userId: user.id, userName: user.name! });
      if (isNewUser) {
        try {
          const sheetId: string = await createSheet({ userId: user.id });
          console.log("Sheet created with ID:", sheetId);
          user.sheetId = sheetId;
        } catch (error) {
          console.error("Sheet creation error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        if (user.sheetId) {
          token.sheetId = user.sheetId;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        if (token.sheetId) {
          session.user.sheetId = token.sheetId as string;
        }
      }
      return session;
    },
  },
};