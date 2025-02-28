// @/app/s/components/sheet.tsx
import CornerCell from "./corner-cell";
import ColumnHeaders from "./column-headers";
import RowHeaders from "./row-headers";
import BodyCells from "./body-cells";

import { CELL_WIDTH, CORNER_SIDE, HEADER_HEIGHT, TOOLBAR_HEIGHT } from "@/lib/constants";

import getColumns from "@/data/getColumns";
import getRows from "@/data/getRows";
import getCells from "@/data/getCells";

interface SheetProps {
  sheetId: string;
}

// const TOOLBAR_HEIGHT = 68;

export default async function Sheet({ sheetId }: SheetProps) {
  const columns = await getColumns(sheetId);
  const rows = await getRows(sheetId);
  const cells = await getCells(sheetId);

  return (
    <div
      style={{
        gridTemplate: `${CORNER_SIDE}px 1fr / ${CELL_WIDTH}px 1fr`,
        maxHeight: `calc(100svh - (${HEADER_HEIGHT}px + ${TOOLBAR_HEIGHT}px))`,
      }}
      className="grid overflow-auto max-w-screen hidden-scrollbar"
    >
      <CornerCell />
      <ColumnHeaders columns={columns} rows={rows} cells={cells} />
      <RowHeaders columns={columns}rows={rows} cells={cells} />
      <BodyCells columns={columns} rows={rows} cells={cells} />
    </div>
  );
}
