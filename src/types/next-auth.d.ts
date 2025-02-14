// @/types/next-auth.d.ts

import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

// Session の型定義を拡張
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      sheetId?: string;
    } & DefaultSession["user"];
  }

  interface User {
    sheetId?: string;
  }
}

// JWT の型定義を拡張
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    sheetId?: string;
  }
}
