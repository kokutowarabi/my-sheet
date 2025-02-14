import SignOutButton from "@/app/s/[sheetId]/sign-out";
import getUser from "@/data/getUser";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import getSheets from "@/data/getSheets";
import Link from "next/link";

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
    <main className="flex justify-center items-center min-h-[100svh]">
      <div className="flex flex-col items-center space-y-4">
        {sheets.map(sheet => (
          <Link
            key={sheet.id}
            href={`/s/${sheet.id}`}
            className="hover:underline"
          >
            {sheet.sheetName}
          </Link>
        ))}
      </div>
      <SignOutButton />
      <span>{user.userName}</span>
    </main>
  )
}