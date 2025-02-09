// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    // デフォルトの user 型に id プロパティを追加
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
