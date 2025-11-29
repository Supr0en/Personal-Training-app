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
import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import AddTrainingForm from "./AddTrainingForm";
import { getTrainings, deleteTraining } from "../TraininingApi";
import type { ColumnDef } from "@tanstack/react-table";

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
          list.map((training: Training) =>
            fetch(training._links.customer.href)
              .then(response => response.json())
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
        .catch((error: Error) => console.log(error))
    }
  }

  const columns: ColumnDef<Training>[] = useMemo(
    () => [
      { header: "Date", accessorKey: "date", cell: info => {
        const rawDate = info.getValue() as string;
        return dayjs(rawDate).format('DD/MM/YYYY hh:mm')
      } },
      { header: "Duration", accessorKey: "duration", }, 
      { header: "Activity", accessorKey: "activity", },
      { header: "FirstName", accessorKey: "details.firstname", },
      { header: "LastName", accessorKey: "details.lastname", },
      { id: "actions", header: "Actions",
        cell: ({ row }) => {
          const deleteUrl = row.original._links.self.href;
          return (
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => {handleDelete(deleteUrl)}}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
              </button>
            </div>
          );
        }
      },
    ],
    []
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
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
      <AddTrainingForm fetchTrainings={fetchTrainings} />
      <table className="border ml-auto mr-auto">
      <thead className="bg-gray-100">
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id} className="p-2 border-b text-center" onClick={header.column.getToggleSortingHandler()}>
                {header.column.getCanFilter() && (
                  <input
                    type="text"
                    placeholder="Filter..."
                    value={(header.column.getFilterValue() ?? "") as string}
                    onChange={e => header.column.setFilterValue(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                )
                }{flexRender(header.column.columnDef.header, header.getContext())}
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
