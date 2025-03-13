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
          className={`${isDragging && 'bg-blue-100 border-l-2 border-y-2 border-l-blue-500 border-y-blue-500'}`}
        />
      )} 
    />
  );
}
