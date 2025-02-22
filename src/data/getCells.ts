// @/data/getCells.ts
import { supabase } from "@/lib/supabase-client";

export default async function getCells(sheetId: string): Promise<Cell[]> {
  const { data, error } = await supabase
    .from("cells")
    .select("*")
    .eq('sheetId', sheetId);

  if (error) {
    console.error("Error fetching cells:", error);
    return [];
  }

  return data || [];
}

// // @/data/getCells.ts

// import { supabase } from "@/lib/supabase-client";

// /**
//  * すでに全てのセルが存在している前提の場合、  
//  * cells 配列の順番を columns と rows の順序に合わせて並び替えます。
//  */
// const sortCellsByGrid = (
//   columns: Column[],
//   rows: Row[],
//   cells: Cell[],
// ): Cell[] => {
//   const sorted: Cell[] = [];
//   for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
//     for (let colIndex = 0; colIndex < columns.length; colIndex++) {
//       const currentColumnId = columns[colIndex].id;
//       const currentRowId = rows[rowIndex].id;
//       const found = cells.find(
//         (c) => c.columnId === currentColumnId && c.rowId === currentRowId
//       );
//       if (found) {
//         sorted.push(found);
//       }
//     }
//   }
//   return sorted;
// };

// export default async function getCells(sheetId: string): Promise<Cell[]> {
//   // columns を sheetId で取得し、columnOrder の昇順に並び替え
//   const { data: columns, error: columnsError } = await supabase
//     .from("columns")
//     .select("*")
//     .eq("sheetId", sheetId)
//     .order("columnOrder", { ascending: true });

//   if (columnsError) {
//     console.error("Error fetching columns:", columnsError);
//     return [];
//   }
//   // const columns = columnsData as Column[];

//   // rows を sheetId で取得し、rowOrder の昇順に並び替え
//   const { data: rows, error: rowsError } = await supabase
//     .from("rows")
//     .select("*")
//     .eq("sheetId", sheetId)
//     .order("rowOrder", { ascending: true });

//   if (rowsError) {
//     console.error("Error fetching rows:", rowsError);
//     return [];
//   }

//   // cells を sheetId で取得
//   const { data: cells, error: cellsError } = await supabase
//     .from("cells")
//     .select("*")
//     .eq("sheetId", sheetId);

//   if (cellsError) {
//     console.error("Error fetching cells:", cellsError);
//     return [];
//   }
//   // const cells = cellsData as Cell[];

//   // columns と rows の順序に合わせて cells を並び替え
//   const sortedCells = sortCellsByGrid(columns, rows, cells);
//   console.log("sorted Cells");
//   return sortedCells;
// }
