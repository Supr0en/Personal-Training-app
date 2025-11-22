import type { Training } from "./Types";
import React, { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

export default function TrainingsList(){
  const [trainings, setTrainings] = useState<Training[]>([]);
  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = () => {
    fetch("https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings")
      .then((response) => {
        if (!response.ok)
          throw new Error(
            "Error when fetching customers" + response.statusText,
          );
        return response.json();
      })
      .then(trainings => {
        setTrainings(trainings._embedded?.trainings ?? []);
      })
      .catch(err => console.error(err))
  };
  const columns: ColumnDef<Training>[] = useMemo(
    () => [
      { header: "Date", accessorKey: "date", meta: { type: "string" } },
      { header: "Duration", accessorKey: "duration", meta: { type: "number" }, 
        filterFn: (row, columnId, filterValue) => {
          const cellValue = row.getValue(columnId);
          if (!filterValue) return true;
          if (!isNaN(filterValue)) {
            return Number(cellValue) === Number(filterValue);
          }
          return String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase());
        },
      },
      { header: "Activity", accessorKey: "activity", meta: { type: "string" } },
    ],
    []
  );
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const table = useReactTable({
    data: trainings,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel : getSortedRowModel(),
    state: { sorting, columnFilters },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    defaultColumn: {
      size: 200,
      minSize: 50,
      maxSize: 200,
    }
  });
  return (
    <>
      <h1>TrainingsList</h1>
      <table className="border">
      <thead className="bg-gray-100">
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id} className="p-2 border-b text-center" onClick={header.column.getToggleSortingHandler()}>
                {header.column.getCanFilter() && (
                  <input
                    type={header.column.columnDef.meta?.type}
                    placeholder="Filter..."
                    value={(header.column.getFilterValue() ?? "") as string}
                    onChange={e => header.column.setFilterValue(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                {flexRender(header.column.columnDef.header, header.getContext())}
                {{
                  asc: " 🔼",
                  desc: " 🔽",
                }[header.column.getIsSorted() as string] ?? null}              
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id} className="hover:bg-gray-50">
            {row.getVisibleCells().map(cell => (
              <td key={cell.id} className="p-2 border-b text-center">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </>
  )
}
