"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Cell from "./cell"; // 元の Cell コンポーネントを再利用

interface SortableRowProps {
  row: Row;
}

export default function SortableRow({ row }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: row.id });

  console.log(row.rowName, row.id);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Cell rowId={row.id} value={row.rowName} variant="rowHeader" />
    </div>
  );
}
