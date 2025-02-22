// @/app/page.tsx

import getSheets from "@/data/getSheets";
import getUser from "@/data/getUser";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/sign-in");
  }

  const userId = session.user.id;
  const user = await getUser(userId);
  if (!user) return;
  const sheets = await getSheets(userId);

  return (
    <main className="flex justify-center items-center min-h-[100svh] gap-10">
      <Link className="" href={`/u/${userId}`}>
        <span>プロフィール</span>
        <div className="flex gap-2">
          <div className="bg-pink-600 w-6 h-6 rounded-full" />
          <span>{user.userName}</span>
        </div>
      </Link>
      {sheets.map((sheet) => (
        <Link
          key={sheet.id}
          href={`/s/${sheet.id}`}
          className="p-4 border border-gray-400 rounded-md bg-gray-200 hover:bg-gray-400 flex items-center gap-2"
        >
          <div className="bg-pink-600 w-6 h-6 rounded-full" />
          <span>{sheet.sheetName}</span>
        </Link>
      ))}
    </main>
  );
}
