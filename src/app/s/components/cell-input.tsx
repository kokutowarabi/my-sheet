// @/app/s/components/sheet/cell-input.tsx
'use client';

import { useState } from "react";

import updateColumn from "@/actions/update/updateColumn";
import updateRow from "@/actions/update/updateRow";
import updateCell from "@/actions/update/updateCell";

interface CellInputProps {
  columnId?: string;
  rowId?: string;
  cellId?: string;
  value: string;
}

export default function CellInput({
  columnId,
  rowId,
  cellId,
  value: initialValue,
}: CellInputProps) {
  const [value, setValue] = useState(initialValue);
  const [isUpdating, setIsUpdating] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState<string | null>(null);

  const updateFunction = async (newValue: string) => {
    if (cellId) {
      return await updateCell({ cellId, newValue });
    }

    if (columnId) {
      return await updateColumn({ columnId, newValue });
    }

    if (rowId) {
      return await updateRow({ rowId, newValue });
    }

    return false;
  }

  const upsertData = async () => {
    if (initialValue === value) return; // 値が変わっていないなら更新しない

    if (isUpdating) {
      setPendingUpdate(value); // 更新中なら pending に保存しておく
      return;
    }

    setIsUpdating(true);

    const success = await updateFunction(value);

    if (!success) {
      console.error(`Failed to upsert value with ID: ${value}`);
      setValue(value); // エラー時に元の値に戻す
    }

    setIsUpdating(false);

    // もし更新中に新しい入力があれば、それをもう一度更新する
    if (pendingUpdate !== null) {
      setPendingUpdate(null);
      upsertData();
    }
  };

  const handleBlur = () => {
    upsertData();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  return (
    <input
      className="w-[80%] h-fit bg-transparent hover:shadow-[0_0_5px_0px_gray] rounded-md py-px px-2 hover:cursor-pointer focus:cursor-text transition"
      value={value}
      placeholder="..."
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  );
}
