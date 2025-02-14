"use client";

import { useState } from "react";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import SortableRow from "./sortable-row"; // カスタムソート可能なカラムコンポーネント
import Cell from "./cell";
import updateRowOrder from "@/actions/update/update-row-order";

interface RowHeadersProps {
  rows: Row[];
}

export default function RowHeaders({ rows: initialRows }: RowHeadersProps) {
  const [rows, setRows] = useState<Row[]>(initialRows); // ステートで行順序を管理
  const [activeRow, setActiveRow] = useState<Row | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event: any) => {
    const activeId = event.active.id;
    const active = rows.find((row) => row.id === activeId);
    setActiveRow(active || null);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setActiveRow(null);
      return;
    }

    // ドラッグ前の順番を保持
    const prevOrder = [...rows];

    const oldIndex = prevOrder.findIndex((row) => row.id === active.id);
    const newIndex = prevOrder.findIndex((row) => row.id === over.id);

    const newOrder = [...prevOrder];
    const [movedItem] = newOrder.splice(oldIndex, 1);
    newOrder.splice(newIndex, 0, movedItem);

    setRows(newOrder);
    setActiveRow(null);

    // 位置が変化した行のみ抽出して updateRowOrder に伝える
    const changedRows = newOrder.reduce((acc, row, idx) => {
      const prevIdx = prevOrder.findIndex((prevRow) => prevRow.id === row.id);
      if (prevIdx !== idx) {
        acc.push({
          id: row.id,
          order: idx,
          name: row.rowName,
        });
      }
      return acc;
    }, [] as { id: string; order: number; name: string }[]);

    await updateRowOrder(changedRows);
  };

  return (
    <DndContext
      id="row-headers"
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={rows.map((row) => row.id)} strategy={verticalListSortingStrategy}>
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
