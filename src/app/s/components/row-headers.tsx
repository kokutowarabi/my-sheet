"use client";

import { useState } from "react";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import SortableRow from "./sortable-row"; // カスタムソート可能なカラムコンポーネント
import Cell from "./cell";

interface RowHeadersProps {
  rows: Row[];
}

export default function RowHeaders({ rows: initialRows }: RowHeadersProps) {
  const [rows, setRows] = useState<Row[]>(initialRows); // ステートでカラム順序を管理
  const [activeRow, setActiveRow] = useState<Row | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event: any) => {
    const activeId = event.active.id;
    const active = rows.find((row) => row.id === activeId);
    setActiveRow(active || null);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id){
      setActiveRow(null);
      return;
    }

    const oldIndex = rows.findIndex((col) => col.id === active.id);
    const newIndex = rows.findIndex((col) => col.id === over.id);

    const newOrder = [...rows];
    const [movedItem] = newOrder.splice(oldIndex, 1);
    newOrder.splice(newIndex, 0, movedItem);

    setRows(newOrder);
    setActiveRow(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={rows.map((col) => col.id)} strategy={verticalListSortingStrategy}>
        <div className="sticky left-0 z-row-headers">
          {rows.map((row) => (
            <SortableRow key={row.id} row={row} />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeRow ? (
          <div className="border-l border-l-gray-400/80">
            <Cell rowId={activeRow.id} value={activeRow.rowName} variant="rowHeader" />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
