// @/components/RowHeaders.ts
"use client";

import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import SortableRow from "./sortable-row"; // カスタムソート可能な行コンポーネント
import Cell from "./cell";
import updateOrder from "@/actions/update/update-order";
import useSortableItems from "@/lib/use-sortable-items";

interface Row {
  id: string;
  rowName: string;
  rowOrder: number;
  // 他の必要なフィールドがあればここに追加
}

interface RowHeadersProps {
  rows: Row[];
}

export default function RowHeaders({ rows: initialRows }: RowHeadersProps) {
  // updateOrder を利用して行の順序更新を行うためのラッパー関数
  const updateRowOrder = async (changedItems: { id: string; order: number; name: string }[]) => {
    await updateOrder("row", changedItems);
  };

  const { items: rows, activeItem: activeRow, handleDragStart, handleDragEnd } =
    useSortableItems(initialRows, updateRowOrder, (row) => row.rowName);

  const sensors = useSensors(useSensor(PointerSensor));

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
            <Cell rowId={`overlay-${activeRow.id}`} value={activeRow.rowName} variant="rowHeader" />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
