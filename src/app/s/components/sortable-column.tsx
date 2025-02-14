"use client";

import SortableItem from "./sortable-item";
import Cell from "./cell"; // 元の Cell コンポーネントを再利用

interface SortableColumnProps {
  column: Column;
}

export default function SortableColumn({ column }: SortableColumnProps) {
  return (
    <SortableItem id={column.id} item={column} render={(col) => (
      <Cell columnId={col.id} value={col.columnName} variant="columnHeader" />
    )} />
  );
}
