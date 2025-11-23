import type { Training } from "./Types";
import dayjs from 'dayjs';
import { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import AddTrainingForm from "./AddTrainingForm";
import { getTrainings, deleteTraining } from "../TraininingApi";

export default function TrainingsList(){
  const [trainings, setTrainings] = useState<Training[]>([]);
  useEffect(() => {
    fetchTrainings();
  }, []);
  
  const fetchTrainings = () => {
    getTrainings()
      .then(trainings => {
        const list = trainings._embedded?.trainings ?? [];
        return Promise.all(
          list.map(training =>
            fetch(training._links.customer.href)
              .then(res => res.json())
              .then(details => ({
                ...training,
                details: {
                  firstname: details.firstname,
                  lastname: details.lastname,
                },
            }))
          )
        );
      })
      .then(fullTtrainings => {
        setTrainings(fullTtrainings)
      })
      .catch(error => console.error(error))
  };
  const handleDelete = (url: string) => {
    if (window.confirm("Are you sure?")) {
      deleteTraining(url)
        .then(() => fetchTrainings())
        .catch((error) => console.log(error))
    }
  }

  const columns: ColumnDef<Training>[] = useMemo(
    () => [
      { header: "Date", accessorKey: "date", meta: { type: "string" }, cell: info => {
        const rawDate = info.getValue() as string;
        return dayjs(rawDate).format('DD/MM/YYYY hh:mm')
      } },
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
      { header: "FirstName", accessorKey: "details.firstname", meta: { type: "string" } },
      { header: "LastName", accessorKey: "details.lastname", meta: { type: "string" } },
      { id: "actions", header: "Actions",
        cell: ({ row }) => {
          const deleteUrl = row.original._links.self.href;
          return (
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => {handleDelete(deleteUrl)}}>Delete</button>
            </div>
          );
        }
      },
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
      size: 150,
      minSize: 50,
      maxSize: 150,
    }
  });
  return (
    <>
      <h1>TrainingsList</h1>
      <AddTrainingForm fetchTrainings={fetchTrainings()} />
      <table className="border ml-auto mr-auto">
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
