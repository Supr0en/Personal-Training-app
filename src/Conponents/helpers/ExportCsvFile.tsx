import { useReactTable, type Row } from "@tanstack/react-table";

export const exportCsvFile = <T,>(table: ReturnType<typeof useReactTable<T>>) => {
    const rows: Row<T>[] = table.getFilteredRowModel().rows;
    const csvRows: string[] = rows.map((row) => row.getVisibleCells().filter((cell): cell is typeof cell & {
        column: { columnDef: {accessorKey: keyof T} };
      } => 'accessorKey' in cell.column.columnDef      
      ).map((cell) => {
        const value = cell.getValue() as | string | number | boolean | null | undefined; 
        return value !== undefined && value !== null ? `"${value}"` : '""';
      }).join(',')
    );
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'customers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
