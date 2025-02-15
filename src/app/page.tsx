// @/app/page.tsx

import getSheets from "@/data/getSheets";
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
  const sheets = await getSheets(userId);

  return (
    <main className="flex justify-center items-center min-h-[100svh] gap-10">
      <Link className="hover:underline" href={`/u/${userId}`}>プロフィール</Link>
      {sheets.map((sheet) => (
        <Link className="hover:underline" href={`/s/${sheet.id}`}>シート</Link>
      ))}
    </main>
  );
}
