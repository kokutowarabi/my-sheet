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
  arraySwap,
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

interface SortableCellProps {
  item: Cell;
  swappedCellIds: string[];
  currentOverId: string | null;
  onTransitionEnd: (id: string) => void;
}

const SortableCell = memo(function SortableCell({ item, swappedCellIds, currentOverId, onTransitionEnd }: SortableCellProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: item.id,
      transition: {
        duration: 1000,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      },
    });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
  };

  // swappedCellIds に含まれている場合は border と bg-gray-50 を付与
  // さらに、現在 hover 中（currentOverId === item.id）で swapped 状態でない場合、別のハイライト（ここでは bg-gray-50 のみ）を適用する例
  const cellClasses = swappedCellIds.includes(item.id) && 'border-t border-l';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onTransitionEnd={(e) => {
        // transform の transition が完了し、実際に元の位置に戻っているかを確認
        if (e.propertyName === 'transform' && getComputedStyle(e.currentTarget).transform === 'none') {
          onTransitionEnd(item.id);
        }
      }}
    >
      <Cell
        cellId={item.id}
        value={item.value}
        variant="default"
        columnId={item.columnId}
        rowId={item.rowId}
        className={`${isDragging ? 'bg-blue-100 border-2 border-blue-500' : ''} ${cellClasses}`}
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
  // 現在 hover しているセルの ID（UI上のハイライト用途として利用）
  const [currentOverId, setCurrentOverId] = useState<string | null>(null);
  // swap されたセルの ID を配列で管理（複数セルに border/bg-gray-50 を付与可能）
  const [swappedCellIds, setSwappedCellIds] = useState<string[]>([]);
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

  // ドラッグ開始時の処理
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const currentCell = cellItems.find((cell) => cell.id === active.id) || null;
    setActiveDragId(active.id.toString());
    setActiveCell(currentCell);
  }, [cellItems, setActiveDragId]);

  // ドラッグ中、over 対象が変わったら前回の over 対象を swappedCellIds に追加し currentOverId を更新
  const handleDragMove = useCallback((event: DragMoveEvent) => {
    const { active, over } = event;
    if (!over) return;
    const newOverId = over.id.toString();
    setCurrentOverId((prev) => {
      if (prev && prev !== newOverId) {
        setSwappedCellIds((prevSwapped) => {
          if (!prevSwapped.includes(prev)) {
            return [...prevSwapped, prev];
          }
          return prevSwapped;
        });
      }
      return newOverId;
    });
    setActiveDragId(active.id.toString());
    const currentCell = cellItems.find((cell) => cell.id === active.id) || null;
    setActiveCell(currentCell);
  }, [cellItems, setActiveDragId]);

  // セルの transition 終了時に呼ばれるコールバック
  const handleCellTransitionEnd = useCallback((id: string) => {
    setSwappedCellIds((prev) => prev.filter((cellId) => cellId !== id));
  }, []);

  // ドラッグ終了時の処理
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
      // arraySwap を使ってアイテムの入れ替え
      setCellItems((prevItems) => arraySwap(prevItems, oldIndex, newIndex));
    }
    // ドラッグ終了時は各状態をクリア（swappedCellIds もここでクリア）
    setActiveCell(null);
    setCurrentOverId(null);
    setActiveDragId(null);
    setSwappedCellIds([]);
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
            return (
              <SortableCell
                key={item.id}
                item={item}
                swappedCellIds={swappedCellIds}
                currentOverId={currentOverId}
                onTransitionEnd={handleCellTransitionEnd}
              />
            );
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
            className="shadow-lg hover:bg-white"
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
