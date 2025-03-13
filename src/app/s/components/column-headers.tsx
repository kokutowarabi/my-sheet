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
  const { setOverColumns, setActiveHeaderDrag, overColumns } = useDragStore();

  const [initialColumnOrder, setInitialColumnOrder] = useState<number | null>(null);
  const [localDiff, setLocalDiff] = useState<number>(0);

  const updateColumnOrder = async (changedItems: { id: string; order: number }[]) => {
    await updateOrder("column", changedItems);
    // ドラッグ終了後、親コンポーネントで columns の順序更新を反映させる前提
  };

  const { items: columns, activeItem: activeColumn, handleDragStart, handleDragEnd } =
    useSortableItems(initialColumns, updateColumnOrder, 'columnOrder');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  useEffect(() => {
    setOverColumns([]);
    setLocalDiff(0);
    setInitialColumnOrder(null);
  }, [columns, setOverColumns]);

  useEffect(() => {
    if (activeColumn && initialColumnOrder !== null) {
      const newDiff = overColumns.length > 0
        ? (overColumns[overColumns.length - 1].columnOrder - initialColumnOrder) * CELL_WIDTH
        : 0;
      setLocalDiff(newDiff);
    } else {
      setLocalDiff(0);
    }
  }, [activeColumn, initialColumnOrder, overColumns]);

  const onDragStart = (event: DragStartEvent) => {
    setOverColumns([]);
    setLocalDiff(0);
    setInitialColumnOrder(null);

    handleDragStart(event);
    const { active } = event;
    const currentActiveColumn = columns.find((col) => col.id === active.id);
    if (currentActiveColumn) {
      setInitialColumnOrder(currentActiveColumn.columnOrder);
    }
    setActiveHeaderDrag({ type: "column", id: active.id.toString() });
  };

  const onDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (!over || !activeColumn) return;
    const overColumn = columns.find((col) => col.id === over.id);
    if (!overColumn) return;

    setOverColumns((prev) => {
      if (prev.length > 0) {
        const firstDiff = prev[0].columnOrder - (initialColumnOrder ?? 0);
        const currentDiff = overColumn.columnOrder - (initialColumnOrder ?? 0);
        if (firstDiff !== 0 && Math.sign(firstDiff) !== Math.sign(currentDiff)) {
          // ドラッグ方向が変わった場合はリセット
          return [{ id: over.id.toString(), columnOrder: overColumn.columnOrder }];
        }
      }
      const index = prev.findIndex((o) => o.id === over.id.toString());
      if (index === -1) {
        return [...prev, { id: over.id.toString(), columnOrder: overColumn.columnOrder }];
      } else {
        return prev.slice(0, index + 1);
      }
    });
  };

  const onDragEnd = (event: DragEndEvent) => {
    handleDragEnd(event);
    setActiveHeaderDrag(null);
    setOverColumns([]);
    setLocalDiff(0);
    setInitialColumnOrder(null);
  };

  const activeStyle = { transform: `translateX(${localDiff}px)` };
  const overStyle = localDiff > 0
    ? { transform: `translateX(${-CELL_WIDTH}px)` }
    : { transform: `translateX(${CELL_WIDTH}px)` };

  const isActiveColumn = (col: Column): boolean =>
    activeColumn ? col.id === activeColumn.id : false;

  const getColumnStyle = (col: Column): { transform?: string } => {
    if (activeColumn && isActiveColumn(col)) return activeStyle;
    if (overColumns.some((o) => o.id === col.id)) return overStyle;
    return {};
  };

  const getSortedCells = (columnId: string): Cell[] => {
    return cells
      .filter((cell) => cell.columnId === columnId)
      .sort((a, b) => {
        const rowA = rows.find((row) => row.id === a.rowId);
        const rowB = rows.find((row) => row.id === b.rowId);
        return (rowA?.rowOrder ?? 0) - (rowB?.rowOrder ?? 0);
      });
  };

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
            <div
              key={col.id}
              className={`flex flex-col ${activeColumn && isActiveColumn(col) ? 'z-50' : ''}`}
            >
              <SortableColumn column={col} />
              {activeColumn && (
                <div
                  className={`${isActiveColumn(col) && 'transition-transform duration-150 ease'}`}
                  style={getColumnStyle(col)}
                >
                  {getSortedCells(col.id).map((cell) => (
                    <Cell
                      key={cell.id}
                      cellId={cell.id}
                      value={cell.value}
                      variant="default"
                      columnId={cell.columnId}
                      rowId={cell.rowId}
                      className={`${isActiveColumn(col) && 'bg-blue-100 border-x-2 border-x-blue-500 last:border-b-2 last:border-b-blue-500'}`}
                    />
                  ))}
                </div>
              )}
            </div>
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
                <div key={colId} className="scale-[.99] shadow-xl shadow-black">
                  <Cell
                    columnId={`overlay-${col.id}`}
                    // columnId={`overlay-column-headers-${col.id}`}
                    value={col.columnName}
                    variant="columnHeader"
                    className="border-l shadow-lg hover:bg-gray-100"
                  />
                  {getSortedCells(col.id).map((cell) => (
                    <Cell
                      key={cell.id}
                      cellId={cell.id}
                      // cellId={`overlay-column-headers-${cell.id}`}
                      value={cell.value}
                      variant="default"
                      columnId={cell.columnId}
                      rowId={cell.rowId}
                      className="border-l shadow-lg hover:bg-white"
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
