"use client";

import { useState } from "react";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";

interface ChangedItem {
  id: string;
  order: number;
}

/**
 * ソート可能なアイテムの状態管理フック
 * @param initialItems 初期アイテム配列
 * @param updateFn 順序変更があった場合に呼び出す更新関数
 * @param orderKey 順序を示すプロパティ名（例: 'columnOrder' または 'rowOrder'）
 */
export default function useSortableItems<
  K extends string,
  T extends { id: string } & Record<K, number>
>(
  initialItems: T[],
  updateFn: (changedItems: ChangedItem[]) => Promise<void>,
  orderKey: K
) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [activeItem, setActiveItem] = useState<T | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = event.active.id;
    const active = items.find((item) => item.id === activeId);
    setActiveItem(active || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setActiveItem(null);
      return;
    }
    
    // ドラッグ前の順序を保持
    const prevOrder = [...items];
    // active と over のインデックスを取得
    const oldIndex = prevOrder.findIndex((item) => item.id === active.id);
    const newIndex = prevOrder.findIndex((item) => item.id === over.id);

    // 新しい順序を生成
    const newOrder = [...prevOrder];
    const [movedItem] = newOrder.splice(oldIndex, 1);
    newOrder.splice(newIndex, 0, movedItem);

    // 新しい順序に従って各アイテムの orderKey を更新
    const updatedOrder = newOrder.map((item, index) => ({
      ...item,
      [orderKey]: index,
    }));

    // 変更があったアイテムのみ抽出
    const changedItems: ChangedItem[] = [];
    updatedOrder.forEach((item, index) => {
      const prevItem = prevOrder.find(prev => prev.id === item.id);
      if (prevItem && prevItem[orderKey] !== index) {
        changedItems.push({
          id: item.id,
          order: index,
        });
      }
    });

    setItems(updatedOrder);
    setActiveItem(null);
    if (changedItems.length > 0) {
      await updateFn(changedItems);
    }
  };

  return { items, setItems, activeItem, handleDragStart, handleDragEnd };
}
