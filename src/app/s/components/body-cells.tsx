// @/app/s/components/sheet/body-cells.tsx
import { CELL_WIDTH, CELL_HEIGHT } from "@/lib/constants";
import Cell from "./cell";

interface BodyCellsProps {
  columns: Column[];
  rows: Row[];
  // cells: 既存セルの配列。各セルには id, value, および columnId, rowId が含まれる
  cells: {
    id: string;
    value: string;
    columnId: string;
    rowId: string;
  }[];
}

export default function BodyCells({ columns, rows, cells }: BodyCellsProps) {
  // 総列数／総行数の計算（columns と rows の長さのみを使用）
  const totalColumns = columns.length;
  const totalRows = rows.length;
  const totalCells = totalColumns * totalRows;

  return (
    <div
      style={{
        gridTemplateColumns: `repeat(${totalColumns}, ${CELL_WIDTH})`,
        gridTemplateRows: `repeat(${totalRows}, ${CELL_HEIGHT})`
      }}
      className="grid relative z-body-cells"
    >
      {Array.from({ length: totalCells }, (_, index) => {
        // グリッド上の行番号・列番号（0-indexed）を算出
        const rowIndex = Math.floor(index / totalColumns);
        const colIndex = index % totalColumns;

        // 既存の列と行の ID を取得（新規列・行の概念を削除）
        const currentColumnId = columns[colIndex]?.id ?? "";
        const currentRowId = rows[rowIndex]?.id ?? "";

        // 既存のセルがあるかをチェック
        const cell = cells.find(
          (c) => c.columnId === currentColumnId && c.rowId === currentRowId
        );

        return (
          <Cell
            key={cell?.id ?? `${currentColumnId}-${currentRowId}`}
            cellId={cell?.id ?? `${currentColumnId}-${currentRowId}`}
            value={cell?.value ?? ""}
            variant="default"
            columnId={currentColumnId}
            rowId={currentRowId}
          />
        );
      })}
    </div>
  );
}
