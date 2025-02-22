// @/components/ColumnHeaders.ts
'use client'

import { useState, useEffect } from "react";
import updateOrder from "@/actions/update/update-order";
import { CELL_WIDTH } from "@/lib/constants";
import useSortableItems from "@/lib/use-sortable-items";
import useDragStore from "@/stores/use-drag-store";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import Cell from "./cell";
import SortableColumn from "./sortable-column";

interface ColumnHeadersProps {
  columns: Column[];
  rows: Row[];
  cells: Cell[];
}

export default function ColumnHeaders({ columns: initialColumns, rows, cells }: ColumnHeadersProps) {
  const updateColumnOrder = async (changedItems: { id: string; order: number }[]) => {
    await updateOrder("column", changedItems);
    // ドラッグ終了後、親コンポーネントで columns の順序更新を反映させる前提
  };

  const { items: columns, activeItem: activeColumn, handleDragStart, handleDragEnd } =
    useSortableItems(initialColumns, updateColumnOrder);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  const onDragStart = (event: DragStartEvent) => { };

  const onDragOver = (event: DragOverEvent) => { };

  const onDragEnd = (event: DragEndEvent) => { };

  return (
    <DndContext
      id="column-headers"
      sensors={sensors}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      modifiers={[restrictToHorizontalAxis]}
    >
      <SortableContext items={columns.map((col) => col.id)} strategy={horizontalListSortingStrategy}>
        <div className="flex max-h-fit sticky top-0 left-0 z-column-headers">
          {columns.map((col) => (
            <SortableColumn key={col.id} column={col} />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeColumn && (
          <>
            {[
              activeColumn.id,
              ...overColumns.filter((o) => o.id !== activeColumn.id).map((o) => o.id),
            ].map((colId) => {
              const col = columns.find((c) => c.id === colId);
              if (!col) return null;
              return (
                <div key={colId} className="scale-[.99]">
                  <Cell
                    columnId={`overlay-${col.id}`}
                    value={col.columnName}
                    variant="columnHeader"
                    isDragOverlayHeader
                  />
                  {getSortedCells(col.id).map((cell) => (
                    <Cell
                      key={cell.id}
                      cellId={cell.id}
                      value={cell.value}
                      variant="default"
                      columnId={cell.columnId}
                      rowId={cell.rowId}
                      isDragOverlayHeaderCell
                    />
                  ))}
                </div>
              );
            })}
          </>
        )}
      </DragOverlay>
    </DndContext>
  );
}
