// @/app/s/components/sheet/cell.tsx
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
        default: "border-gray-300",
        corner: 'sticky top-0 left-0 z-corner-cell border-t border-l border-gray-400/80',
        columnHeader: "border-t border-gray-400/80",
        rowHeader: "border-l border-gray-400/80",
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
}

export interface CellProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cellVariants> {
  columnId?: string;
  rowId?: string;
  cellId?: string;
  value?: string;
}

const Cell = React.forwardRef<HTMLDivElement, CellProps>(
  ({ columnId, rowId, cellId, value, className, variant }, ref) => {

    if (!variant) {
      return null;
    }

    if (value === undefined || variant === "corner") {
      return (
        <div
          ref={ref}
          className={cn(cellVariants({ variant, className }))}
          style={style(variant)}
        />
      );
    }

    return (
      <div
        ref={ref}
        className={cn(cellVariants({ variant, className }))}
        style={style(variant)}
      >
        {variant === 'columnHeader' && (
          <CellInput columnId={columnId} value={value} />
        )}
        {variant === 'rowHeader' && (
          <CellInput rowId={rowId} value={value} />
        )}
        {variant === 'default' && (
          <CellInput columnId={columnId} rowId={rowId} cellId={cellId} value={value} />
        )}
      </div>
    );
  }
);

Cell.displayName = "Cell";

export default Cell;