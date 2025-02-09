import Cell from "./cell";

interface RowHeadersProps {
  rows: Row[];
}

export default function RowHeaders({ rows }: RowHeadersProps) {
  return (
    <div className="sticky left-0 z-row-headers">
      {rows.map((row) => (
        <Cell key={row.id} rowId={row.id} value={row.rowName} variant={"rowHeader"} />
      ))}
    </div>
  )
}