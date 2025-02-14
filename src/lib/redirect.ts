// @/lib/redirect.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Redirect() {
  const session = await getServerSession(authOptions);

  // 新規ユーザーの場合は sheetId が付与されているため、シート編集画面へリダイレクト
  if (session?.user?.sheetId) {
    redirect(`/s/${session.user.sheetId}`);
  }
  // 既存ユーザーの場合は sheetId がないので、ユーザーダッシュボードなどのページへリダイレクト
  else if (session?.user?.id) {
    redirect(`/u/${session.user.id}`);
  }
}
