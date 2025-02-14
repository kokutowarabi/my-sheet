// @/app/api/auth/[...nextauth]/route.ts
import createUser from "@/actions/create/createUser";
import createSheet from "@/actions/create/createSheet";
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      profile(profile: any): { id: string; name: string; email: string; image: string } {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  callbacks: {
    // サインイン時にユーザーの存在チェックを行い、
    // 新規ユーザーの場合はシートを作成して sheetId を付与、
    // 既存ユーザーの場合は sheetId を付与しない
    async signIn({ user }): Promise<boolean> {
      // createUser はユーザーが新規作成された場合に true を返し、
      // 既に存在する場合は false を返すように実装している
      const isNewUser = await createUser({ userId: user.id, userName: user.name! });

      if (isNewUser) {
        try {
          const sheetId: string = await createSheet({ userId: user.id });
          console.log("Sheet created with ID:", sheetId);
          // 新規ユーザーの場合のみ、user オブジェクトに sheetId を付与して jwt に反映させる
          (user as any).sheetId = sheetId;
        } catch (error) {
          console.error("Sheet creation error:", error);
          return false;
        }
      }
      // 既存ユーザーの場合は sheetId を付与しない
      return true;
    },
    // jwt コールバックで user オブジェクトの情報をトークンに保存
    async jwt({ token, user }): Promise<any> {
      if (user) {
        token.id = user.id;
        if ((user as any).sheetId) {
          token.sheetId = (user as any).sheetId;
        }
      }
      return token;
    },
    // session コールバックで jwt の情報をセッションに反映
    async session({ session, token }): Promise<any> {
      if (session.user) {
        session.user.id = token.id as string;
        if (token.sheetId) {
          (session.user as any).sheetId = token.sheetId as string;
        }
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
