import Header from "../../../components/header";
import Sheet from "../components/sheet";
import getSheets from "@/data/getSheets";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";

interface SheetPageProps {
  params: Promise<{ sheetId: string }>
}

export default async function SheetPage({ params }: SheetPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/sign-in");
  }

  const sheetId = (await params).sheetId;
  const sheets = await getSheets();
  const currentSheet = sheets.find(sheet => sheet.id === sheetId);

  if (!currentSheet) {
    return <main className="flex justify-center items-center min-h-[100svh]">シートが見つかりません。</main>;
  }

  if (currentSheet.userId !== session.user.id) {
    return <main className="flex justify-center items-center min-h-[100svh]">アクセス権がありません。</main>;
  }

  return (
    <>
      <Header sheetName={currentSheet.sheetName} />
      {/* <Toolbar /> */}
      <main>
        <Sheet sheetId={sheetId} />
      </main>
    </>
  )
}