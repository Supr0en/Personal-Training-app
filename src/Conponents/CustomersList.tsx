import type { Customer } from "./Types.ts";
import React, { useState, useEffect, useMemo } from "react";
import { getCustomers } from "../Api.ts";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import AddCustomerForm from "./AddCustomerForm.tsx";

export default function CustomersList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  useEffect(() => {
    fetchCustomers();
  }, []);
  
  const fetchCustomers = () => {
    getCustomers()
      .then(customerData => setCustomers(customerData._embedded.customers))
      .catch((error) => console.log(error));
  }

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
  const [columnFilters, setColumnFilters] = useState([]);
  const table = useReactTable({
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getRowId: row => row.email,
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
      <h1>CustomersList</h1>
      <AddCustomerForm fetchCustomers={fetchCustomers()} />
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
  );
}
