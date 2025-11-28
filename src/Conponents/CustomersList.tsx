import type { Customer } from "./Types.ts";
import { useState, useEffect, useMemo } from "react";
import { deleteCustomer, getCustomers } from "../Api.ts";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import EditCustomerForm from "./EditCustomerForm.tsx";
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

  const handleDelete = (url: string) => {
    if (window.confirm("Are you sure?")) {
      deleteCustomer(url)
        .then(() => fetchCustomers())
        .catch((error) => console.log(error))
    }
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
      { id: "actions", header: "Actions",
        cell: ({ row }) => {
          const deleteUrl = row.original._links.self.href;
          const customerRow = row.original;
          return (
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => {handleDelete(deleteUrl)}}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
              </button>
              <EditCustomerForm fetchCustomers={fetchCustomers} customerRow={customerRow} /> 
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

  const exportExcel = (table) => {
    const rows: row<any>[] = table.getFilteredRowModel().rows;
    const csvRows = rows.map(row => row.getVisibleCells().filter(cell => {
      return cell.column.columnDef.accessorKey;
    }).map(cell => `"${cell.getValue()}"`).join(','));
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'table.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <>
      <h1>CustomersList</h1>
      <AddCustomerForm fetchCustomers={fetchCustomers} />
      <button className="px-4 py-2 bg-blue-500 text-white rounded m-1" type="button" onClick={() => exportExcel(table)}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M230-360h120v-60H250v-120h100v-60H230q-17 0-28.5 11.5T190-560v160q0 17 11.5 28.5T230-360Zm156 0h120q17 0 28.5-11.5T546-400v-60q0-17-11.5-31.5T506-506h-60v-34h100v-60H426q-17 0-28.5 11.5T386-560v60q0 17 11.5 30.5T426-456h60v36H386v60Zm264 0h60l70-240h-60l-40 138-40-138h-60l70 240ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z"/></svg>
      </button>
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
