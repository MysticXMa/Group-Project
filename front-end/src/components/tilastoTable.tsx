// src/components/tilastoTable.tsx
import React, { useState, useEffect } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  TableMeta,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import type { Tilasto } from "../types/tilasto";
import { fetchTilasto, saveTilasto } from "../api/tilastoApi.ts";
import TimeInput from "./timeInput.tsx";

// Extend TableMeta so that we can update cell data (only for rasti columns)
interface ExtendedTableMeta extends TableMeta<Tilasto> {
  updateData: (rowIndex: number, columnId: string, value: unknown) => void;
}

// Helper to format time (seconds) into MM:SS
const timeFormat = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

// Define the maximum allowed total time in seconds (example: 7 minutes = 420 seconds)
const MAX_MINUTES = 7;
const MAX_TOTAL_SECONDS = MAX_MINUTES * 60; // 420 seconds

// Create the column helper for our combined type
const columnHelper = createColumnHelper<Tilasto>();

const TilastoTable = () => {
  const [data, setData] = useState<Tilasto[]>([]);
  const [originalData, setOriginalData] = useState<Tilasto[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the data on component mount
  useEffect(() => {
    const loadData = async () => {
      const fetchedData = await fetchTilasto();
      setData(fetchedData);
      setOriginalData(fetchedData);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Determine the maximum number of Rasti columns across all rows
  const rastiCount = data.reduce(
    (max, row) => Math.max(max, row.rastiAjat.length),
    0
  );

  // Define the table columns: first the joukkue columns, then the dynamic rasti columns, then the yhteensä column
  const columns = [
    // Joukkue columns (read-only)
    columnHelper.accessor("ryhmä", {
      header: ({ column }) => (
        <div onClick={() => column.toggleSorting()} className="column-header">
          Ryhmä{" "}
          {column.getIsSorted() === "asc"
            ? "↑"
            : column.getIsSorted() === "desc"
            ? "↓"
            : ""}
        </div>
      ),
      cell: ({ getValue }) => getValue(),
    }),
    columnHelper.accessor("koulu", {
      header: ({ column }) => (
        <div onClick={() => column.toggleSorting()} className="column-header">
          Koulu{" "}
          {column.getIsSorted() === "asc"
            ? "↑"
            : column.getIsSorted() === "desc"
            ? "↓"
            : ""}
        </div>
      ),
      cell: ({ getValue }) => getValue(),
    }),
    columnHelper.accessor("joukkue", {
      header: ({ column }) => (
        <div onClick={() => column.toggleSorting()} className="column-header">
          Joukkue{" "}
          {column.getIsSorted() === "asc"
            ? "↑"
            : column.getIsSorted() === "desc"
            ? "↓"
            : ""}
        </div>
      ),
      cell: ({ getValue }) => getValue(),
    }),
    // Dynamic Rasti columns (editable in edit mode)
    ...Array.from({ length: rastiCount }, (_, index) =>
      columnHelper.accessor((row) => row.rastiAjat[index] ?? 0, {
        id: `rasti_${index}`,
        header: ({ column }) => (
          <div onClick={() => column.toggleSorting()} className="column-header">
            Rasti {index + 1}{" "}
            {column.getIsSorted() === "asc"
              ? "↑"
              : column.getIsSorted() === "desc"
              ? "↓"
              : ""}
          </div>
        ),
        cell: ({ row, table }) => {
          const rowData = row.original;
          const totalSeconds =
            rowData.rastiAjat[index] !== undefined
              ? rowData.rastiAjat[index]
              : 0;

          // When not editing display the formatted time
          if (!isEditing) {
            return timeFormat(totalSeconds);
          }

          return (
            <TimeInput
              value={totalSeconds}
              onChange={(newTotal) => {
                (table.options.meta as ExtendedTableMeta).updateData(
                  row.index,
                  `rasti_${index}`,
                  newTotal
                );
              }}
              maxTotalSeconds={MAX_TOTAL_SECONDS} // Pass the maximum allowed time
            />
          );
        },
      })
    ),
    // Yhteensä column (read-only)
    columnHelper.accessor(
      (row) => row.rastiAjat.reduce((sum, time) => sum + time, 0),
      {
        id: "yhteensa",
        header: ({ column }) => (
          <div onClick={() => column.toggleSorting()} className="column-header">
            Yhteensä{" "}
            {column.getIsSorted() === "asc"
              ? "↑"
              : column.getIsSorted() === "desc"
              ? "↓"
              : ""}
          </div>
        ),
        cell: ({ getValue }) => timeFormat(getValue()),
      }
    ),
  ];

  // Create the table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
    meta: {
      updateData: (rowIndex: number, columnId: string, value: unknown) => {
        setData((oldData) =>
          oldData.map((row, idx) => {
            if (idx === rowIndex) {
              const rastiIndex = Number(columnId.replace("rasti_", ""));
              const newRastiAjat = [...row.rastiAjat];
              newRastiAjat[rastiIndex] = value as number;
              return { ...row, rastiAjat: newRastiAjat };
            }
            return row;
          })
        );
      },
    } as ExtendedTableMeta,
  });

  // Editing controls
  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    setIsLoading(true);
    await saveTilasto(data);
    setOriginalData(data);
    setIsEditing(false);
    setIsLoading(false);
  };

  const handleCancel = () => {
    setData(originalData);
    setIsEditing(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (localStorage.getItem("admin") === "true") {
    return (
      <div className="taulukko-table table-wrapper">
        <table className="taulukko">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                <th id="number-column">#</th>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1}</td>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="actions">
          {isEditing ? (
            <>
              <button onClick={handleSave}>Save</button>
              <button onClick={handleCancel} className="cancel">
                Cancel
              </button>
            </>
          ) : (
            <button onClick={handleEdit}>Edit</button>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="taulukko-table table-wrapper">
        <table className="taulukko">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                <th id="number-column">#</th>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1}</td>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
};

export default TilastoTable;
