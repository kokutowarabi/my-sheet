import createUser from "@/actions/create/createUser";
import createSheet from "@/actions/create/createSheet";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
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
    // signIn コールバックでユーザー作成とシート作成を実施し、
    // 成功した場合はリダイレクト先の URL を返す
    async signIn({ user }) {
      const userCreated = await createUser({ userId: user.id, userName: user.name! });
      console.log("User creation or exists check:", userCreated);
      if (userCreated) {
        try {
          const sheetId = await createSheet({ userId: user.id });
          console.log("Sheet created with ID:", sheetId);
          // sheetId を利用してリダイレクト先の URL を返す
          return `/s/${sheetId}`;
        } catch (error) {
          console.error("Sheet creation error:", error);
          return false;
        }
      }
      return false;
    },
    // jwt コールバックでユーザー情報を JWT トークンに保存
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // ※ 必要に応じて、ここでも sheetId を保存する場合は、user.sheetId があるなら token にセットする
        if ((user as any).sheetId) {
          token.sheetId = (user as any).sheetId;
        }
      }
      console.log("JWT callback token:", token);
      return token;
    },
    // session コールバックでトークンからセッションに情報をセット
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).sheetId = token.sheetId as string;
      }
      console.log("Session callback:", session);
      return session;
    },
    // redirect コールバックでは、signIn で返された URL（リダイレクト先）をそのまま返す
    redirect({ url }) {
      return url;
    },
  },
});

export { handler as GET, handler as POST };
