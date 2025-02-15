// @/app/s/components/sheet/cell.tsx
'use client';
import * as React from "react";
import { CELL_WIDTH, CELL_HEIGHT, CORNER_SIDE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import CellInput from "./cell-input";

const cellVariants = cva(
  "border-r border-b flex justify-center items-center bg-white",
  {
    variants: {
      variant: {
        default: "cursor-pointer border-gray-300 hover:bg-gray-100",
        corner: 'sticky top-0 left-0 z-corner-cell border-t border-l border-gray-400/80 bg-gray-100',
        columnHeader: "cursor-pointer border-t border-gray-400/80 bg-gray-100 hover:bg-gray-300",
        rowHeader: "cursor-pointer border-l border-gray-400/80 bg-gray-100 hover:bg-gray-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const style = (variant: VariantProps<typeof cellVariants>["variant"]) => {
  switch (variant) {
    case "corner":
      return { width: CELL_WIDTH, height: CORNER_SIDE };
    case "rowHeader":
      return { width: CELL_WIDTH, height: CELL_HEIGHT };
    case "columnHeader":
      return { width: CELL_WIDTH, height: CORNER_SIDE };
    default:
      return { width: CELL_WIDTH, height: CELL_HEIGHT };
  }
};

export interface CellProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cellVariants> {
  columnId?: string;
  rowId?: string;
  cellId?: string;
  value?: string;
  isActiveCell?: boolean;
  isGhostCell?: boolean;
}

const Cell = React.forwardRef<HTMLDivElement, CellProps>(
  ({ columnId, rowId, cellId, value, className, variant, isActiveCell, isGhostCell, ...props }, ref) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleCellClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
        const len = inputRef.current.value.length;
        inputRef.current.setSelectionRange(len, len);
      }
      setIsEditing(true);
    };

    const finishEditing = () => {
      setIsEditing(false);
    };

    if (!variant) {
      return null;
    }

    const activeCellClass = isActiveCell ? 'shadow-lg border-t border-l' : "";
    const ghostCellClass = isGhostCell ? 'bg-gray-100/50 text-gray-400 ring-4 border-none' : "";
    
    const cellClass = cn(cellVariants({ variant, className }), activeCellClass, ghostCellClass);

    if (value === undefined || variant === "corner") {
      return (
        <div
          ref={ref}
          className={cn(cellVariants({ variant, className }))}
          style={style(variant)}
          onClick={handleCellClick}
          {...props}
        />
      );
    }

    return (
      <div
        ref={ref}
        className={cellClass}
        style={style(variant)}
        onClick={handleCellClick}
        {...props}
      >
        {variant === "columnHeader" && (
          <CellInput
            ref={inputRef}
            columnId={columnId}
            value={value}
            onFinishEditing={finishEditing}
          />
        )}
        {variant === "rowHeader" && (
          <CellInput
            ref={inputRef}
            rowId={rowId}
            value={value}
            onFinishEditing={finishEditing}
          />
        )}
        {variant === "default" && (
          <CellInput
            ref={inputRef}
            columnId={columnId}
            rowId={rowId}
            cellId={cellId}
            value={value}
            onFinishEditing={finishEditing}
          />
        )}
      </div>
    );
  }
);

Cell.displayName = "Cell";

export default Cell;
