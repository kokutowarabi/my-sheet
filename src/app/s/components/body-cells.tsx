// @/app/s/components/sheet/body-cells.tsx
'use client'

import { updateCellPositions } from "@/actions/update/update-cell-positions";
import { CELL_HEIGHT, CELL_WIDTH } from "@/lib/constants";
import useDragStore from "@/stores/use-drag-store";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSwappingStrategy,
  useSortable,
  type AnimateLayoutChanges,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { memo, useCallback, useLayoutEffect, useMemo, useState } from "react";
import Cell from "./cell";

interface BodyCellsProps {
  columns: Column[];
  rows: Row[];
  cells: Cell[];
}

/**
 * columns と rows の順序に合わせて cells を並び替える関数
 */
const sortCellsByGrid = (
  columns: Column[],
  rows: Row[],
  cells: Cell[],
): Cell[] => {
  const sorted: Cell[] = [];
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
      const currentColumnId = columns[colIndex].id;
      const currentRowId = rows[rowIndex].id;
      const found = cells.find(
        (c) => c.columnId === currentColumnId && c.rowId === currentRowId
      );
      if (found) {
        sorted.push(found);
      }
    }
  }
  return sorted;
};

const SortableCell = memo(function SortableCell({ item }: { item: Cell }) {
  const animateLayoutChanges: AnimateLayoutChanges = () => false;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id, animateLayoutChanges });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      // className={isDragging ? "ring-2 ring-blue-500" : ""}
      {...attributes}
      {...listeners}
    >
      <Cell
        cellId={item.id}
        value={item.value}
        variant="default"
        columnId={item.columnId}
        rowId={item.rowId}
        // isGhostCell={isDragging}
        className={`${isDragging && 'bg-blue-100 border-2 border-blue-500'}`}
      />
    </div>
  );
});

export default function BodyCells({ columns, rows, cells }: BodyCellsProps) {
  const totalColumns = columns.length;
  const totalRows = rows.length;

  // 初期化時にソート済みのセルを設定
  const [cellItems, setCellItems] = useState<Cell[]>(() => sortCellsByGrid(columns, rows, cells));

  // レンダリング前に並び替え状態を更新
  useLayoutEffect(() => {
    setCellItems(sortCellsByGrid(columns, rows, cells));
  }, [columns, rows, cells]);

  // ドラッグ中のセルを管理
  const [activeCell, setActiveCell] = useState<Cell | null>(null);
  const { activeHeaderDrag, overRows, overColumns, setActiveDragId } = useDragStore();

  // 各セルのインデックスマップ
  const cellIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    cellItems.forEach((item, index) => {
      map.set(item.id, index);
    });
    return map;
  }, [cellItems]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  const gridStyle = useMemo<React.CSSProperties>(
    () => ({
      gridTemplateColumns: `repeat(${totalColumns}, ${CELL_WIDTH}px)`,
      gridTemplateRows: `repeat(${totalRows}, ${CELL_HEIGHT}px)`,
    }),
    [totalColumns, totalRows]
  );

  // セルのドラッグ開始時に activeCell と activeDragId を更新
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const currentCell = cellItems.find((cell) => cell.id === active.id) || null;
    setActiveDragId(active.id.toString());
    setActiveCell(currentCell);
  }, [cellItems, setActiveDragId]);

  const handleDragMove = useCallback((event: DragMoveEvent) => {
    const { active } = event;
    setActiveDragId(active.id.toString());
    const currentCell = cellItems.find((cell) => cell.id === active.id) || null;
    setActiveCell(currentCell);
  }, [cellItems, setActiveDragId]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const activeCellData = cellItems.find((cell) => cell.id === active.id);
      const overCellData = cellItems.find((cell) => cell.id === over.id);
      if (!activeCellData || !overCellData) {
        setActiveCell(null);
        return;
      }

      const success = updateCellPositions(activeCellData, overCellData);
      if (!success) {
        setActiveCell(null);
        throw new Error("セルの位置情報の更新に失敗しました");
      }

      const oldIndex = cellIndexMap.get(active.id.toString());
      const newIndex = cellIndexMap.get(over.id.toString());
      if (oldIndex === undefined || newIndex === undefined) {
        setActiveCell(null);
        return;
      }
      setCellItems((prevItems) => {
        const newItems = [...prevItems];
        [newItems[oldIndex], newItems[newIndex]] = [newItems[newIndex], newItems[oldIndex]];
        return newItems;
      });
    }
    setActiveCell(null);
    setActiveDragId(null);
  }, [cellIndexMap, cellItems, setActiveDragId]);

  return (
    <DndContext
      id="body-cells"
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={cellItems.map((item) => item.id)} strategy={rectSwappingStrategy}>
        <div style={gridStyle} className="grid">
          {cellItems.map((item) => {
            const isHidden =
              (activeHeaderDrag &&
                ((activeHeaderDrag.type === "column" && item.columnId === activeHeaderDrag.id) ||
                 (activeHeaderDrag.type === "row" && item.rowId === activeHeaderDrag.id))) ||
              (item.rowId && overRows.some((overRow) => overRow.id === item.rowId)) ||
              (item.columnId && overColumns.some((overColumn) => overColumn.id === item.columnId));
            if (isHidden) {
              return (
                <div key={item.id} style={{ width: CELL_WIDTH, height: CELL_HEIGHT }} />
              );
            }
            return <SortableCell key={item.id} item={item} />;
          })}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeCell && (
          <Cell
            cellId={activeCell.id}
            value={activeCell.value}
            variant="default"
            columnId={activeCell.columnId}
            rowId={activeCell.rowId}
            className="shadow-lg border-t border-l"
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
