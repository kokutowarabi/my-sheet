// @/components/ColumnHeaders.ts
"use client";

import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import SortableColumn from "./sortable-column"; // 各列コンポーネント
import Cell from "./cell"; // 元の Cell コンポーネント
import updateOrder from "@/actions/update/update-order";
import useSortableItems from "@/lib/use-sortable-items";

interface ColumnHeadersProps {
  columns: Column[];
  rows: Row[];
  cells: Cell[];
}

export default function ColumnHeaders({ columns: initialColumns, rows, cells }: ColumnHeadersProps) {
  // updateOrder に "column" タイプを指定して呼び出すラッパー関数を作成
  const updateColumnOrder = async (changedItems: { id: string; order: number; name: string }[]) => {
    await updateOrder("column", changedItems);
  };

  const {
    items: columns,
    activeItem: activeColumn,
    handleDragStart,
    handleDragEnd,
  } = useSortableItems(initialColumns, updateColumnOrder, (col) => col.columnName);

  const sensors = useSensors(useSensor(PointerSensor));

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
            <Cell columnId={`overlay-${activeColumn.id}`} value={activeColumn.columnName} variant="columnHeader" />
            {cells
              .filter((cell) => cell.columnId === activeColumn.id)
              .sort((a, b) => {
                const rowA = rows.find((row) => row.id === a.rowId);
                const rowB = rows.find((row) => row.id === b.rowId);
                // 見つからなければ 0 を返す（同じ順序とみなす）
                return (rowA?.rowOrder ?? 0) - (rowB?.rowOrder ?? 0);
              })
              .map((cell) => (
                <Cell key={cell.id} columnId={cell.columnId} value={cell.value} variant="default" />
              ))}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
