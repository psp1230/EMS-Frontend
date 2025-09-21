"use client"

import { X } from "lucide-react"
import type { Table } from "@tanstack/react-table"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/ui/data-table/data-table-view-options"
import { DataTableFacetedFilter } from "@/components/ui/data-table/data-table-faceted-filter"
import type { ComponentType } from "react"

export type ColumnFilterOption = {
  column: string
  title?: string
  options: Array<{ label: string; value: string; icon?: ComponentType<{ className?: string | undefined }> }>
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  options?: ColumnFilterOption[]
  filterCol?: string
  // 自訂篩選組件
  customFilters?: ReactNode
}

export function DataTableToolbar<TData>({ table, options, filterCol, customFilters }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="space-y-4">
      {/* 自訂篩選區域 */}
      {customFilters && <div className="w-full">{customFilters}</div>}

      {/* 原有的篩選工具欄 */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {filterCol && !customFilters && (
            <Input
              placeholder={`Filters...`}
              value={(table.getColumn(filterCol)?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn(filterCol)?.setFilterValue(event.target.value)}
              className="h-8 w-[150px] lg:w-[250px]"
            />
          )}
          {options &&
            options.length > 0 &&
            options.map((option, index) => (
              <DataTableFacetedFilter
                key={index}
                column={table.getColumn(option.column)}
                title={option.title ?? option.column}
                options={option.options}
              />
            ))}
          {isFiltered && (
            <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
