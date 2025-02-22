// @/app/s/components/sheet/cell-input.tsx
'use client';

import React, { useState, forwardRef } from "react";
import updateColumn from "@/actions/update/update-column";
import updateRow from "@/actions/update/update-row";
import updateCell from "@/actions/update/update-cell";
import useDragStore from "@/stores/use-drag-store";

export interface CellInputProps {
  columnId?: string;
  rowId?: string;
  cellId?: string;
  value: string;
  onFinishEditing?: () => void;
}

const CellInput = forwardRef<HTMLInputElement, CellInputProps>(({
  columnId,
  rowId,
  cellId,
  value: initialValue,
  onFinishEditing,
}, ref) => {
  const [value, setValue] = useState(initialValue);
  const [isUpdating, setIsUpdating] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState<string | null>(null);

  // ここでは dnd の activationConstraint により、短いクリックなら編集ができる
  const isEditingDisabled = false; // 入力自体は常に編集可能（ただしドラッグが発生した場合は dnd が起動します）

  const inputId = cellId || columnId || rowId;
  const inputName = cellId ? `cell-${cellId}` : columnId ? `column-${columnId}` : `row-${rowId}`;

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
  };

  const upsertData = async () => {
    if (initialValue === value) return;
    if (isUpdating) {
      setPendingUpdate(value);
      return;
    }
    setIsUpdating(true);
    const success = await updateFunction(value);
    if (!success) {
      console.error(`Failed to upsert value: ${value}`);
      setValue(initialValue);
    }
    setIsUpdating(false);
    if (pendingUpdate !== null) {
      setPendingUpdate(null);
      upsertData();
    }
  };

  const handleBlur = async () => {
    await upsertData();
    if (onFinishEditing) {
      onFinishEditing();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const len = e.target.value.length;
    e.target.setSelectionRange(len, len);
  };

  return (
    <input
      id={inputId}
      name={inputName}
      ref={ref}
      className="w-[80%] h-fit bg-transparent rounded-md py-px px-2 transition cursor-pointer focus:outline-none"
      value={value}
      disabled={isEditingDisabled}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
    />
  );
});

CellInput.displayName = "CellInput";

export default CellInput;
