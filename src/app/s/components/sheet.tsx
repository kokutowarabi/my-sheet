// @/app/s/components/sheet.tsx
import CornerCell from "./corner-cell";
import ColumnHeaders from "./column-headers";
import RowHeaders from "./row-headers";
import BodyCells from "./body-cells";

import { CELL_WIDTH, CORNER_SIDE } from "@/lib/constants";

import getColumns from "@/data/getColumns";
import getRows from "@/data/getRows";
import getCells from "@/data/getCells";

interface SheetProps {
  sheetId: string;
}

export default async function Sheet({ sheetId }: SheetProps) {
  const columns = await getColumns(sheetId);
  const rows = await getRows(sheetId);
  const cells = await getCells(sheetId);

  return (
    <div
      style={{
        gridTemplate: `${CORNER_SIDE} 1fr / ${CELL_WIDTH} 1fr`,
      }}
      className="grid overflow-auto max-w-screen max-h-[calc(100vh-(65px+68px))] hidden-scrollbar"
    >
      <CornerCell />
      <ColumnHeaders columns={columns} rows={rows} cells={cells} />
      <RowHeaders columns={columns}rows={rows} cells={cells} />
      <BodyCells columns={columns} rows={rows} cells={cells} />
    </div>
  );
}
