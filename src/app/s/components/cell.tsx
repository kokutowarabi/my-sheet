// @/app/s/components/sheet/cell.tsx
'use client';
import * as React from "react";
import { CELL_WIDTH, CELL_HEIGHT, CORNER_SIDE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import CellInput from "./cell-input";

const cellVariants = cva(
  'border-r border-b flex justify-center items-center bg-white',
  {
    variants: {
      variant: {
        default: "cursor-pointer border-gray-300",
        corner: 'sticky top-0 left-0 z-corner-cell border-t border-l border-gray-400/80 bg-gray-100',
        columnHeader: "cursor-pointer border-t border-gray-400/80 bg-gray-100",
        rowHeader: "cursor-pointer border-l border-gray-400/80 bg-gray-100",
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
      return { minWidth: `${CELL_WIDTH}px`, minHeight: `${CORNER_SIDE}px` };
    case "rowHeader":
      return { minWidth: `${CELL_WIDTH}px`, minHeight: `${CELL_HEIGHT}px` };
    case "columnHeader":
      return { minWidth: `${CELL_WIDTH}px`, minHeight: `${CORNER_SIDE}px` };
    default:
      return { minWidth: `${CELL_WIDTH}px`, minHeight: `${CELL_HEIGHT}px` };
  }
};

export interface CellProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cellVariants> {
  columnId?: string;
  rowId?: string;
  cellId?: string;
  value?: string;
  className?: string;

  isGhostCell?: boolean;

  isGhostHeader?: boolean;
}

const Cell = React.forwardRef<HTMLDivElement, CellProps>(
  ({
    columnId,
    rowId,
    cellId,
    value,
    className,
    variant,

    isGhostCell,

    isGhostHeader,

    ...props
  }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleCellClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
        const len = inputRef.current.value.length;
        inputRef.current.setSelectionRange(len, len);
      }
    };

    if (!variant) {
      return null;
    }

    const ghostCellClass = isGhostCell ? 'bg-gray-100/50 text-gray-400' : "";

    const ghostHeaderClass = isGhostHeader ? 'border-x-2 border-x-blue-500 border-t-2 border-t-blue-500' : "";

    // セルがホバー状態でない場合の条件をまとめる
    const shouldDisableHover =
      isGhostCell ||
      isGhostHeader;

    // セルの variant に応じたホバー時の背景色のクラスを決定する
    const hoverBgClass =
      variant === 'default'
        ? 'hover:bg-gray-100'
        : 'hover:bg-gray-300';

    // 上記条件に基づいて、ホバー時のクラスを適用するかどうか決定
    const hoverClass = shouldDisableHover ? '' : hoverBgClass;

    const cellClass =
      cn(cellVariants({ variant, className }),
        ghostCellClass,
        ghostHeaderClass,
        hoverClass
      );

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
          />
        )}
        {variant === "rowHeader" && (
          <CellInput
            ref={inputRef}
            rowId={rowId}
            value={value}
          />
        )}
        {variant === "default" && (
          <CellInput
            ref={inputRef}
            columnId={columnId}
            rowId={rowId}
            cellId={cellId}
            value={value}
          />
        )}
      </div>
    );
  }
);

Cell.displayName = "Cell";

export default Cell;
