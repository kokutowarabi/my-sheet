import getUser from "@/data/getUser";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import getSheets from "@/data/getSheets";
import Link from "next/link";
import { authOptions } from "@/lib/auth-options";

interface UserPageProps {
  params: Promise<{ userId: string }>
}

export default async function UserPage({ params }: UserPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/sign-in");
  }

  const userId = (await params).userId;
  const user = await getUser(userId);
  if (!user) {
    return <main className="flex justify-center items-center min-h-[100svh]">ユーザーが見つかりません。</main>;
  }

  const sheets = await getSheets(userId);

  return (
    <main className="flex flex-col justify-start min-h-[100svh] max-h-[100svh] px-10 pb-10">
      <div className="flex gap-10 items-center justify-start w-full pt-20 pb-8 px-10">
        <div className="rounded-full bg-pink-200 w-20 h-20" />
        <span className="text-4xl">{user.userName}</span>
      </div>
      <div className="flex flex-col gap-10 items-start py-10 px-10 w-full h-[80svh] overflow-y-auto hover:bg-gray-100 rounded-md hidden-scrollbar transition">
        {sheets.map(sheet => (
          <Link
            key={sheet.id}
            href={`/s/${sheet.id}`}
            className="p-6 w-full rounded-md text-2xl bg-white hover:bg-gray-500 hover:text-white text-gray-600 font-bold transition shadow-md"
          >
            {sheet.sheetName}
          </Link>
        ))}
      </div>
    </main>
  )
}