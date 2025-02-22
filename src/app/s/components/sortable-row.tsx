"use client";

import SortableItem from "./sortable-item";
import Cell from "./cell";

interface SortableRowProps {
  row: Row;
}

export default function SortableRow({ row }: SortableRowProps) {
  return (
    <SortableItem 
      id={row.id} 
      item={row} 
      render={(r, isDragging) => (
        <Cell 
          rowId={r.id} 
          value={r.rowName} 
          variant="rowHeader"
          isGhostCell={isDragging}
        />
      )} 
    />
  );
}
