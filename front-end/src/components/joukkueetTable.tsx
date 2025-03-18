import React from "react"
import { useState, useEffect } from "react"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  TableMeta,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"
import type { Joukkue } from "../types/joukkue"
import { fetchJoukkueet, saveJoukkueet } from "../api/joukkueetApi.ts"

// Extend TableMeta to include updateData method for handling data updates
interface ExtendedTableMeta extends TableMeta<Joukkue> {
  updateData: (rowIndex: number, columnId: string, value: unknown) => void;
}

// Helper to create column definitions for the table
const columnHelper = createColumnHelper<Joukkue>()

const JoukkueetTable = () => {
  // State management
  const [data, setData] = useState([])
  const [originalData, setOriginalData] = useState([])
  const [sorting, setSorting] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      const fetchedData = await fetchJoukkueet()
      setData(fetchedData)
      setOriginalData(fetchedData)
      setIsLoading(false)
    }
    loadData()
  }, [])

  // Define table columns with custom headers, sortability and editable cells
  const columns = [
    columnHelper.accessor("ryhmä", {
      header: ({column}) => (
        <div onClick={() => column.toggleSorting()} className="column-header">
          Ryhmä {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
        </div>
      ),
      cell: ({ getValue, row, column, table }) => {
        const initialValue = getValue()
        return isEditing ? (
          <input
            defaultValue={initialValue}
            onBlur={(e) => {
              (table.options.meta as ExtendedTableMeta).updateData(row.index, column.id, Number(e.target.value))
            }}
            type="number"
          />
        ) : (
          initialValue
        )
      },
    }),
    columnHelper.accessor("koulu", {
      header: ({ column }) => (
        <div onClick={() => column.toggleSorting()} className="column-header">
          Koulu {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
        </div>
      ),
      cell: ({ getValue, row, column, table }) => {
        const initialValue = getValue()
        return isEditing ? (
          <input
            defaultValue={initialValue}
            onBlur={(e) => {
              (table.options.meta as ExtendedTableMeta).updateData(row.index, column.id, e.target.value)
            }}
          />
        ) : (
          initialValue
        )
      },
    }),
    columnHelper.accessor("joukkue", {
      header: ({column}) => (
        <div onClick={() => column.toggleSorting()} className="column-header">
          Joukkue {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
        </div>
      ),
      cell: ({ getValue, row, column, table }) => {
        const initialValue = getValue()
        return isEditing ? (
          <input
            defaultValue={initialValue}
            onBlur={(e) => {
              (table.options.meta as ExtendedTableMeta).updateData(row.index, column.id, e.target.value)
            }}
          />
        ) : (
          initialValue
        )
      },
    }),
  ]

  // Initialize the table instance using react-table hook
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting, 
    state: { sorting }, 
    meta: {
      updateData: (rowIndex: number, columnId: string, value: unknown) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              }
            }
            return row
          }),
        );
      },
    } as ExtendedTableMeta, 
  });

  // Add a new row to the table
  const addRow = () => {
    const newRow: Joukkue = {
      ryhmä: 0,
      koulu: "",
      joukkue: "",
    }
    setData([...data, newRow]) 
    setIsEditing(true) 
  }

  // Remove a row by index
  const removeRow = (index: number) => {
    setData(data.filter((_, i) => i !== index)) 
  }

  // Toggle edit mode
  const handleEdit = () => {
    setIsEditing(true)
  }

  // Save the data to the API
  const handleSave = async () => {
    setIsLoading(true)
    await saveJoukkueet(data)
    setOriginalData(data) 
    setIsEditing(false) 
    setIsLoading(false) 
  }

  // Cancel the edit and restore original data
  const handleCancel = () => {
    setData(originalData) 
    setIsEditing(false) 
  }

  // Show loading state while fetching data
  if (isLoading) {
    return <div>Loading...</div>
  }

  // Main render for the table UI
  if (localStorage.getItem("admin")===true) {
    return (
      <div className="joukkueet-table table-wrapper">
        <table className="taulukko">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                <th id="number-column">#</th>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
                ))}
                {isEditing && <th id="actions-column">Actions</th>} 
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1}</td>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
                {isEditing && (
                  <td>
                    <button onClick={() => removeRow(index)}>Remove</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="actions">
          {isEditing ? (
            <>
              <button onClick={addRow}>Add Row</button>
              <div>
                <button onClick={handleSave}>Save</button>
                <button onClick={handleCancel} className="cancel">
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <button onClick={handleEdit}>Edit</button>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="joukkueet-table table-wrapper">
        <table className="taulukko">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                <th id="number-column">#</th>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1}</td>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default JoukkueetTable
