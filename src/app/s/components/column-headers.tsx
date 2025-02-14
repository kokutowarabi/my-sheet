"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import SortableColumn from "./sortable-column"; // 各列コンポーネント
import Cell from "./cell"; // 元の Cell コンポーネント

interface ColumnHeadersProps {
  columns: Column[];
}

export default function ColumnHeaders({ columns: initialColumns }: ColumnHeadersProps) {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null); // 現在ドラッグしているカラム

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event: any) => {
    const activeId = event.active.id;
    const active = columns.find((col) => col.id === activeId);
    setActiveColumn(active || null);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setActiveColumn(null);
      return;
    }

    const oldIndex = columns.findIndex((col) => col.id === active.id);
    const newIndex = columns.findIndex((col) => col.id === over.id);

    const newOrder = [...columns];
    const [movedItem] = newOrder.splice(oldIndex, 1);
    newOrder.splice(newIndex, 0, movedItem);

    setColumns(newOrder);
    setActiveColumn(null);
  };

  return (
    <DndContext
      id="column-headers"
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToHorizontalAxis]}
    >
      <SortableContext items={columns.map((col) => col.id)} strategy={horizontalListSortingStrategy}>
        <div className="flex max-h-fit sticky top-0 left-0 z-column-headers">
          {columns.map((column) => (
            <SortableColumn key={column.id} column={column} />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeColumn ? (
          <div className="border-l border-l-gray-400/80">
            <Cell columnId={activeColumn.id} value={activeColumn.columnName} variant="columnHeader" />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
