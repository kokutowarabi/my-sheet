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
          isGhostHeader={isDragging}
        />
      )}
    />
  );
}
