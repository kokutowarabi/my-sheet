// @/lib/use-sortable-items.ts
import { useState } from "react";

export default function useSortableItems<T extends { id: string }>(
  initialItems: T[],
  updateFn: (changedItems: { id: string; order: number; name: string }[]) => Promise<void>,
  getName: (item: T) => string
) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [activeItem, setActiveItem] = useState<T | null>(null);

  const handleDragStart = (event: any) => {
    const activeId = event.active.id;
    const active = items.find((item) => item.id === activeId);
    setActiveItem(active || null);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setActiveItem(null);
      return;
    }

    const prevOrder = [...items];
    const oldIndex = prevOrder.findIndex((item) => item.id === active.id);
    const newIndex = prevOrder.findIndex((item) => item.id === over.id);

    const newOrder = [...prevOrder];
    const [movedItem] = newOrder.splice(oldIndex, 1);
    newOrder.splice(newIndex, 0, movedItem);

    setItems(newOrder);
    setActiveItem(null);

    // 位置が変化したアイテムのみ抽出
    const changedItems = newOrder.reduce((acc, item, idx) => {
      const prevIdx = prevOrder.findIndex((prevItem) => prevItem.id === item.id);
      if (prevIdx !== idx) {
        acc.push({
          id: item.id,
          order: idx,
          name: getName(item),
        });
      }
      return acc;
    }, [] as { id: string; order: number; name: string }[]);

    await updateFn(changedItems);
  };

  return { items, setItems, activeItem, handleDragStart, handleDragEnd };
}
