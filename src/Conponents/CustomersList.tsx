import type { Customer } from "../Conponents/Types.ts";
import React, { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from "@tanstack/react-table";
export default function CustomersList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    fetch("https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers")
      .then((response) => {
        if (!response.ok)
          throw new Error(
            "Error when fetching customers" + response.statusText,
          );
        return response.json();
      })
      .then(customers => {
        console.log(customers)
        setCustomers(customers._embedded?.customers ?? []);
      })
      .catch(err => console.error(err))
  };
  const columns: ColumnDef<Customer>[] = useMemo(
    () => [
      { header: "First Name", accessorKey: "firstname" },
      { header: "Last Name", accessorKey: "lastname" },
      { header: "Street Address", accessorKey: "streetaddress" },
      { header: "Postcode", accessorKey: "postcode" },
      { header: "City", accessorKey: "city" },
      { header: "Email", accessorKey: "email" },
      { header: "Phone", accessorKey: "phone", enableSorting: false},
    ],
    []
  );
  const [sorting, setSorting] = useState([]);
  const table = useReactTable({
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getRowId: row => row.email,
    getSortedRowModel : getSortedRowModel(),
    state: { sorting },
  });

  return (
    <>
      <h1>CustomersList</h1>
      <table className="min-w-full border">
      <thead className="bg-gray-100">
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id} className="p-2 border-b text-left" onClick={header.column.getToggleSortingHandler()}>
                {flexRender(header.column.columnDef.header, header.getContext())}
                {{
                  asc: " 🔼",
                  desc: " 🔽",
                }[header.column.getIsSorted() as string] ?? null}              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id} className="hover:bg-gray-50">
            {row.getVisibleCells().map(cell => (
              <td key={cell.id} className="p-2 border-b">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table> 
    </>
  );
}
