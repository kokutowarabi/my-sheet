"use client";

import SortableItem from "./sortable-item";
import Cell from "./cell";

interface SortableColumnProps {
  column: Column;
}

export default function SortableColumn({ column }: SortableColumnProps) {
  return (
    <SortableItem
      id={column.id}
      item={column}
      render={(col, isDragging) => (
        <Cell
          columnId={col.id}
          value={col.columnName}
          variant="columnHeader"
          className={`${isDragging && 'bg-blue-100 border-t-2 border-x-2 border-t-blue-500 border-x-blue-500'}`}
        />
      )}
    />
  );
}
