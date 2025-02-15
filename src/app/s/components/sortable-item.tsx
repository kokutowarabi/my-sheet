// @/components/SortableItem.tsx
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps<T> {
  id: string;
  item: T;
  render: (item: T, isDragging: boolean) => React.ReactNode;
}

export default function SortableItem<T>({ id, item, render }: SortableItemProps<T>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {render(item, isDragging)}
    </div>
  );
}
