import Header from "../../../components/header";
import Sheet from "../components/sheet";
import getSheets from "@/data/getSheets";
import Toolbar from "../components/toolbar";

interface SheetPageProps {
  params: Promise<{ sheetId: string }>
}

export default async function SheetPage({ params }: SheetPageProps) {
  const sheetId = (await params).sheetId;
  const sheets = await getSheets();
  const currentSheet = sheets.find(sheet => sheet.id === sheetId);

  if (!currentSheet) {
    return <main className="flex justify-center items-center min-h-[100svh]">シートが見つかりません。</main>;
  }

  return (
    <>
      <Header sheetName={currentSheet.sheetName} />
      <Toolbar />
      <main>
        <Sheet sheetId={sheetId} />
      </main>
    </>
  )
}