"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type ExpandedState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

import { NoData } from "../no-data"

import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination"
import { type ColumnFilterOption, DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar"
import { cn } from "@/lib/utils"
import type { RowSelectionState } from "@tanstack/react-table"

interface DataTablePaginationConfig {
  pageSizeOptions?: number[]
  pageSize?: number
  pageIndex?: number
  total?: number
  totalPage?: number
  showPageNumbers?: boolean
  showFirstLastButtons?: boolean
  showTotal?: boolean
  showQuickJumper?: boolean
  labels?: {
    displayItemCount?: string
    page?: string
    to?: string
    firstPage?: string
    previousPage?: string
    nextPage?: string
    lastPage?: string
    total?: string
    jumper?: string
  }
  onPageSizeChange?: (pageSize: number) => void
  onPageChange?: (pageIndex: number) => void
}

interface DataTableProps<TData, TValue> {
  className?: string
  topContent?: React.ReactNode
  showViewOptions?: boolean
  filterCol?: string
  filterOptions?: ColumnFilterOption[]
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pagination?: boolean | DataTablePaginationConfig
  disableSelect?: boolean
  resetSelected?: boolean
  hideID?: boolean
  // collapsible 相關 props
  collapsible?: boolean
  renderExpandedRow?: (row: TData) => React.ReactNode
  onRowExpand?: (row: TData, isExpanded: boolean) => void | Promise<void>
  // 自訂篩選組件
  customFilters?: React.ReactNode
  onRowSelectionChange?: (selected: TData[]) => void
  onRefreshData?: () => void
}

export function DataTable<TData, TValue>({
  className,
  columns,
  data,
  pagination,
  disableSelect,
  showViewOptions = true,
  topContent,
  filterCol,
  filterOptions,
  resetSelected,
  hideID,
  collapsible = false,
  renderExpandedRow,
  onRowExpand,
  customFilters,
  onRowSelectionChange,
  onRefreshData,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [expanded, setExpanded] = React.useState<ExpandedState>({})
  const [expandingRows, setExpandingRows] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    if (resetSelected) {
      setRowSelection({})
    }
    onSelectedChange(rowSelection)

    if (hideID) {
      table.getAllColumns().forEach((column) => {
        if (column.id.includes("ID")) {
          column.toggleVisibility(false)
        }
      })
    }
  }, [rowSelection, resetSelected, hideID])

  const onSelectedChange = (selected: RowSelectionState) => {
    const rowSelectionMap = data.filter((_item, index) => selected[index])
    onRowSelectionChange?.(rowSelectionMap)
  }

  // 處理行展開
  const handleRowExpand = async (rowId: string, row: TData) => {
    const isCurrentlyExpanded = expanded[rowId as keyof typeof expanded]
    const willBeExpanded = !isCurrentlyExpanded

    // 如果有 onRowExpand 回調且行將要展開，先調用 API
    if (onRowExpand && willBeExpanded) {
      setExpandingRows(prev => new Set(prev).add(rowId))

      try {
        await onRowExpand(row, willBeExpanded)
      } catch (error) {
        console.error('Error expanding row:', error)
        setExpandingRows(prev => {
          const newSet = new Set(prev)
          newSet.delete(rowId)
          return newSet
        })
        return // 如果 API 調用失敗，不展開行
      }

      setExpandingRows(prev => {
        const newSet = new Set(prev)
        newSet.delete(rowId)
        return newSet
      })
    }

    // 更新展開狀態
    setExpanded(prev => ({
      ...(typeof prev === 'object' && prev !== null ? prev : {}),
      [rowId]: willBeExpanded
    }))

    // 如果行正在收縮且有回調，也調用它
    if (onRowExpand && !willBeExpanded) {
      onRowExpand(row, willBeExpanded)
    }
  }

  // 如果啟用 collapsible，在 columns 前面加上展開按鈕列
  const enhancedColumns = React.useMemo(() => {
    if (!collapsible) return columns

    const expandColumn: ColumnDef<TData, TValue> = {
      id: "expand",
      header: "",
      cell: ({ row }) => {
        const isExpanding = expandingRows.has(row.id)
        const isExpanded: any = expanded[row.id as keyof typeof expanded]

        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => handleRowExpand(row.id, row.original)}
            disabled={isExpanding}
          >
            {isExpanding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        )
      },
      enableSorting: false,
      enableHiding: false,
    }

    return [expandColumn, ...columns]
  }, [columns, collapsible, expandingRows, expanded])

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      expanded,
    },
    manualPagination: Boolean(pagination && typeof pagination === "object" && pagination.totalPage),
    initialState: {
      pagination: {
        pageIndex: typeof pagination === "object" ? (pagination.pageIndex ?? 0) : 0,
        pageSize: typeof pagination === "object" ? (pagination.pageSize ?? 10) : 10,
      },
    },
    enableRowSelection: disableSelect ? false : true,
    enableExpanding: collapsible,
    autoResetPageIndex: false,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    onColumnFiltersChange: (newFilters) => {
      setColumnFilters(newFilters)
      table.setPageIndex(0)
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getExpandedRowModel: getExpandedRowModel(),
  })

  return (
    <div className={cn("", className)}>
      {topContent}
      {showViewOptions && <DataTableToolbar table={table} filterCol={filterCol} options={filterOptions} customFilters={customFilters} />}
      <div className="rounded-md border my-2">
        <Table className="w-full">
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                  {/* 展開的內容行 */}
                  {collapsible && expanded[row.id as keyof typeof expanded] && renderExpandedRow && (
                    <TableRow className="bg-muted/30">
                      <TableCell colSpan={enhancedColumns.length} className="p-0">
                        {renderExpandedRow(row.original)}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={enhancedColumns.length} className="h-24 text-center">
                  <NoData onRefreshData={onRefreshData} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && <DataTablePagination table={table} config={pagination} />}
    </div>
  )
}
