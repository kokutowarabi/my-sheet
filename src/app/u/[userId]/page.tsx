import Aiueo from "@/app/(auth)/sign-in/components/aiueo";
import getUser from "@/data/getUser";

interface UserPageProps {
  params: Promise<{ userId: string }>
}

export default async function UserPage({ params }: UserPageProps) {
  const userId = (await params).userId;
  const user = await getUser(userId);
  if (!user) {
    return <main className="flex justify-center items-center min-h-[100svh]">ユーザーが見つかりません。</main>;
  }

  return (
    <main className="flex justify-center items-center min-h-[100svh]">
      {user.userName}
      <Aiueo />
    </main>
  )
}