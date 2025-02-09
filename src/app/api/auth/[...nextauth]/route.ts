// app/api/auth/[...nextauth]/route.ts
import createUser from "@/actions/create/createUser";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// ユーザーID とユーザー名を受け取り、既存かどうかチェックしてなければ挿入する関数
// async function createUser(userId: string, userName: string): Promise<boolean> {
//   // まず、ユーザーが既に存在するかチェックする
//   if (await verifyUser(userId)){
//     return true;
//   }

//   // 存在しなければ、新規ユーザーとして挿入する
//   const { error: insertError } = await supabase
//     .from("users")
//     .insert({
//       id: userId,
//       userName: userName ?? 'ユーザー名', // 必須カラム userName を設定
//     });

//   if (insertError) {
//     console.error("Error inserting user in Supabase:", insertError);
//     return false;
//   }
//   return true;
// }

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      profile(profile: any): { id: string; name: string; email: string; image: string } {
        return {
          // Google のユーザープロフィールの場合、'sub' をユーザーIDとして利用
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // ユーザーが存在するかチェックし、存在しなければ作成する
      const success = await createUser({userId: user.id, userName: user.name!});
      console.log("User creation or exists check:", success);
      if (success) {
        // ユーザーが存在（または作成）できた場合、サインイン後のリダイレクト先として /{user.id} を返す
        return `/u/${user.id}`;
      }
      // 作成に失敗した場合はサインインを拒否する
      return false;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
});

export { handler as GET, handler as POST };
