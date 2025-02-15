// @/app/s/components/sheet/body-cells.tsx
'use client'

import { useState, useMemo, useCallback, memo } from "react";
import { CELL_WIDTH, CELL_HEIGHT } from "@/lib/constants";
import Cell from "./cell";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragMoveEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSwappingStrategy,
  useSortable,
  type AnimateLayoutChanges,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { updateCellPositions } from "@/actions/update/update-cell-positions";

interface BodyCellsProps {
  columns: Column[];
  rows: Row[];
  cells: Cell[];
}

/**
 * 各グリッド位置に対応するセル情報を生成するユーティリティ関数
 * 存在しないセルは、空セルとして作成する
 */
const generateInitialCellItems = (
  columns: Column[],
  rows: Row[],
  cells: Cell[],
): Cell[] => {
  const totalColumns = columns.length;
  const totalRows = rows.length;
  const totalCells = totalColumns * totalRows;
  const items: Cell[] = [];

  for (let index = 0; index < totalCells; index++) {
    const rowIndex = Math.floor(index / totalColumns);
    const colIndex = index % totalColumns;
    const currentColumnId = columns[colIndex]?.id ?? "";
    const currentRowId = rows[rowIndex]?.id ?? "";

    const found = cells.find(
      (c) => c.columnId === currentColumnId && c.rowId === currentRowId
    );

    if (found) {
      items.push(found);
    } else {
      items.push({
        id: `${currentColumnId}-${currentRowId}`,
        value: "",
        columnId: currentColumnId,
        rowId: currentRowId,
        createdAt: new Date().toISOString(),
        sheetId: "",
      });
    }
  }
  return items;
};

/**
 * ソート可能なセルコンポーネントを React.memo でラップし、
 * 不要な再レンダリングを防ぐ
 */
const MemoSortableCell = memo(function SortableCell({ item }: { item: Cell }) {
  const animateLayoutChanges: AnimateLayoutChanges = () => false;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id, animateLayoutChanges });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Cell
        cellId={item.id}
        value={item.value}
        variant="default"
        columnId={item.columnId}
        rowId={item.rowId}
        isGhostCell={isDragging}
      />
    </div>
  );
});

export default function BodyCells({ columns, rows, cells }: BodyCellsProps) {
  const totalColumns = columns.length;
  const totalRows = rows.length;

  // セル情報の状態（更新可能にしている）
  const [cellItems, setCellItems] = useState<Cell[]>(() =>
    generateInitialCellItems(columns, rows, cells)
  );

  // アクティブなセルを管理する状態
  const [activeCell, setActiveCell] = useState<Cell | null>(null);

  // セルIDからインデックスへのマッピングを memo 化
  const cellIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    cellItems.forEach((item, index) => {
      map.set(item.id, index);
    });
    return map;
  }, [cellItems]);

  // dnd-kit のセンサー設定
  const sensors = useSensors(useSensor(PointerSensor));

  // グリッドのスタイル（useMemo でメモ化）
  const gridStyle = useMemo<React.CSSProperties>(
    () => ({
      gridTemplateColumns: `repeat(${totalColumns}, ${CELL_WIDTH})`,
      gridTemplateRows: `repeat(${totalRows}, ${CELL_HEIGHT})`,
    }),
    [totalColumns, totalRows]
  );

  // イベントハンドラーを useCallback でメモ化
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const currentCell = cellItems.find((cell) => cell.id === active.id) || null;
    setActiveCell(currentCell);
  }, [cellItems]);

  const handleDragMove = useCallback((event: DragMoveEvent) => {
    const { active } = event;
    const currentCell = cellItems.find((cell) => cell.id === active.id) || null;
    setActiveCell(currentCell);
  }, [cellItems]);

  // ドラッグ終了時のハンドラー（swap 状態を反映 & Supabase更新）
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const activeCellData = cellItems.find((cell) => cell.id === active.id);
      const overCellData = cellItems.find((cell) => cell.id === over.id);
      if (!activeCellData || !overCellData) {
        setActiveCell(null);
        return;
      }

      // Supabase側の更新を実行（active と over の位置情報を入れ替え）
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
        // active セルと over セルの位置を入れ替える（swap）
        [newItems[oldIndex], newItems[newIndex]] = [newItems[newIndex], newItems[oldIndex]];
        return newItems;
      });
    }
    setActiveCell(null);
  }, [cellIndexMap, cellItems]);

  return (
    <DndContext
      id="body-cells"
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={cellItems.map((item) => item.id)}
        strategy={rectSwappingStrategy}
      >
        <div style={gridStyle} className="grid relative z-10">
          {cellItems.map((item) => (
            <MemoSortableCell key={item.id} item={item} />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeCell ? (
          <Cell
            cellId={activeCell.id}
            value={activeCell.value}
            variant="default"
            columnId={activeCell.columnId}
            rowId={activeCell.rowId}
            isActiveCell
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
