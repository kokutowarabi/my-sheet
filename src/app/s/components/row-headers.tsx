'use client'

import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import updateOrder from "@/actions/update/update-order";
import useSortableItems from "@/lib/use-sortable-items";
import useDragStore, { OverRow } from "@/stores/use-drag-store";
import Cell from "./cell";
import SortableRow from "./sortable-row";
import { CELL_HEIGHT } from "@/lib/constants";

interface RowHeadersProps {
  columns: Column[];
  rows: Row[];
  cells: Cell[];
}

export default function RowHeaders({ columns, rows: initialRows, cells }: RowHeadersProps) {
  const { setOverRows, setActiveHeaderDrag, overRows } = useDragStore();

  const updateRowOrder = async (changedItems: { id: string; order: number }[]) => {
    await updateOrder("row", changedItems);
  };

  const { items: rows, activeItem: activeRow, handleDragStart, handleDragEnd } =
    useSortableItems(initialRows, updateRowOrder, "rowOrder");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  // ドラッグ開始時の rowOrder とドラッグ中の相対的な変位を計算するためのローカルステート
  const [initialRowOrder, setInitialRowOrder] = useState<number | null>(null);
  const [localDiff, setLocalDiff] = useState<number>(0);

  useEffect(() => {
    setOverRows([]);
    setLocalDiff(0);
    setInitialRowOrder(null);
  }, [rows, setOverRows]);

  useEffect(() => {
    if (activeRow && initialRowOrder !== null) {
      const newDiff = overRows.length > 0
        ? (overRows[overRows.length - 1].rowOrder - initialRowOrder) * CELL_HEIGHT
        : 0;
      setLocalDiff(newDiff);
    } else {
      setLocalDiff(0);
    }
  }, [activeRow, initialRowOrder, overRows]);

  const onDragStart = (event: DragStartEvent) => {
    setOverRows([]);
    setLocalDiff(0);
    setInitialRowOrder(null);

    handleDragStart(event);
    const { active } = event;
    const currentActiveRow = rows.find((row) => row.id === active.id);
    if (currentActiveRow) {
      setInitialRowOrder(currentActiveRow.rowOrder);
    }
    setActiveHeaderDrag({ type: "row", id: active.id.toString() });
  };

  const onDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (!over || !activeRow) return;
    const overRow = rows.find((row) => row.id === over.id);
    if (!overRow) return;

    setOverRows((prev: OverRow[]) => {
      if (prev.length > 0) {
        const firstDiff = prev[0].rowOrder - (initialRowOrder ?? 0);
        const currentDiff = overRow.rowOrder - (initialRowOrder ?? 0);
        if (firstDiff !== 0 && Math.sign(firstDiff) !== Math.sign(currentDiff)) {
          return [{ id: over.id.toString(), rowOrder: overRow.rowOrder }];
        }
      }
      const index = prev.findIndex((o) => o.id === over.id.toString());
      if (index === -1) {
        return [...prev, { id: over.id.toString(), rowOrder: overRow.rowOrder }];
      } else {
        return prev.slice(0, index + 1);
      }
    });
  };

  const onDragEnd = (event: DragEndEvent) => {
    handleDragEnd(event);
    setActiveHeaderDrag(null);
    setOverRows([]);
    setLocalDiff(0);
    setInitialRowOrder(null);
  };

  // activeRow 用の transform（ドラッグ中の行の位置補正用）
  const activeStyle = { transform: `translateY(${localDiff}px)` };
  const overStyle = localDiff > 0
    ? { transform: `translateY(${-CELL_HEIGHT}px)` }
    : { transform: `translateY(${CELL_HEIGHT}px)` };

  const isActiveRow = (row: Row): boolean =>
    activeRow ? row.id === activeRow.id : false;

  // activeRow または overRows に含まれる場合、cell コンテナに適用する transform を返す
  const getRowStyle = (row: Row): { transform?: string } => {
    if (activeRow && row.id === activeRow.id) return activeStyle;
    if (overRows.some((o) => o.id === row.id)) return overStyle;
    return {};
  };

  const getSortedCells = (rowId: string): Cell[] => {
    return cells
      .filter((cell) => cell.rowId === rowId)
      .sort((a, b) => {
        const colA = columns.find((col) => col.id === a.columnId);
        const colB = columns.find((col) => col.id === b.columnId);
        return (colA?.columnOrder ?? 0) - (colB?.columnOrder ?? 0);
      });
  };

  return (
    <DndContext
      id="row-headers"
      sensors={sensors}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={rows.map((row) => row.id)} strategy={verticalListSortingStrategy}>
        <div className="sticky left-0 z-row-headers">
          {rows.map((row) => (
            <div key={row.id} className="flex">
              {/* row header（Sticky などのスタイルは SortableRow 内で管理） */}
              <SortableRow row={row} />
              {/* 対応する cell コンテナにのみ transform スタイルを適用 */}
              {activeRow && (
                <div className="flex transition-transform duration-150 ease" style={getRowStyle(row)}>
                  {getSortedCells(row.id).map((cell) => (
                    <Cell
                      key={cell.id}
                      cellId={cell.id}
                      value={cell.value}
                      variant="default"
                      columnId={cell.columnId}
                      rowId={cell.rowId}
                      // isGhostHeaderCell={activeRow ? row.id === activeRow.id : false}
                      className={`${isActiveRow(row) && 'bg-blue-100 border-y-2 border-y-blue-500 last:border-b-2 last:border-b-blue-500'}`}
                      // className={`${isActiveRow(row) && 'border-y-2 border-y-blue-500 last:border-r-2 last:border-r-blue-500'}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeRow && (
          <div key={activeRow.id} className="scale-[.95] flex">
            <Cell
              rowId={`overlay-${activeRow.id}`}
              value={activeRow.rowName}
              variant="rowHeader"
              // isDragOverlayHeader
              // className="border-l shadow-lg"
              className="border-l-2 shadow-lg border-y-2 border-y-gray-500 border-l-gray-500"
            />
            <div className="flex">
              {getSortedCells(activeRow.id).map((cell) => (
                <Cell
                  key={cell.id}
                  cellId={cell.id}
                  value={cell.value}
                  variant="default"
                  columnId={cell.columnId}
                  rowId={cell.rowId}
                  // isDragOverlayHeaderCell
                  className="border-l shadow-lg border-y-2 border-y-gray-500"
                />
              ))}
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
