import Sheet from "../components/sheet";
import getSheets from "@/data/getSheets";

interface SheetPageProps {
  params: Promise<{ sheetId: string }>
}

export default async function SheetPage({ params }: SheetPageProps) {
  const sheetId = (await params).sheetId;
  const sheets = await getSheets();

  if (!sheets.find(sheet => sheet.id === sheetId)) {
    return <main className="flex justify-center items-center min-h-[100svh]">シートが見つかりません。</main>;
  }

  return (
    <main>
      <Sheet sheetId={sheetId} />
    </main>
  )
}