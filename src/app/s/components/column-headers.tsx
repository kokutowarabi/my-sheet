import Cell from "./cell";

interface ColumnHeadersProps {
  columns: Column[];
}

export default async function ColumnHeaders({ columns }: ColumnHeadersProps) {
  return (
    <div className="flex max-h-fit sticky top-0 left-0 z-column-headers">
      {columns.map((column) => (
        <Cell key={column.id} columnId={column.id} value={column.columnName} variant={'columnHeader'} />
      ))}
    </div>
  )
}