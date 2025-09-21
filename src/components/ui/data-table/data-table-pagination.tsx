"use client"

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowRightCircle } from "lucide-react"
import type { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import React from "react"

interface DataTablePaginationConfig {
  pageSizeOptions?: number[]
  pageSize?: number
  pageIndex?: number
  total?: number
  totalPage?: number // ← 新增：後端回傳的總頁數
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

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  config?: boolean | DataTablePaginationConfig
}

export function DataTablePagination<TData>({ table, config }: DataTablePaginationProps<TData>) {
  const defaultConfig: DataTablePaginationConfig = {
    pageSizeOptions: [10, 20, 30, 40, 50],
    pageSize: 10,
    pageIndex: 0,
    showPageNumbers: true,
    showFirstLastButtons: true,
    showTotal: true,
    showQuickJumper: true,
    labels: {
      displayItemCount: "顯示項目數",
      page: "頁",
      to: "至",
      firstPage: "First",
      previousPage: "Previous",
      nextPage: "Next",
      lastPage: "Last",
      total: "總計",
      jumper: "頁數",
    },
  }

  const paginationConfig: DataTablePaginationConfig =
    typeof config === "object"
      ? {
        ...defaultConfig,
        ...config,
        labels: {
          ...defaultConfig.labels,
          ...(config.labels || {}),
        },
      }
      : defaultConfig

  // 總條目數（顯示用）
  const totalItems = paginationConfig.total ?? table.getFilteredRowModel().rows.length
  const selectedItems = table.getFilteredSelectedRowModel().rows.length

  // 1. 由「資料筆數」算出的總頁數
  const rowsLength = table.getFilteredRowModel().rows.length
  const currentSize = table.getState().pagination.pageSize
  const pageCountFromData = Math.ceil(rowsLength / currentSize)

  // 2. 決定採用後端的 totalPage，或自己算的 pageCountFromData
  const totalPages = paginationConfig.totalPage ?? pageCountFromData

  // 保護 pageIndex 不會超出範圍
  const pageIndexState = table.getState().pagination.pageIndex
  React.useEffect(() => {
    if (pageIndexState >= totalPages) {
      const newIndex = totalPages > 0 ? totalPages - 1 : 0
      table.setPageIndex(newIndex)
      paginationConfig.onPageChange?.(newIndex)
    }
  }, [totalPages, pageIndexState])

  // 設置初始 pageSize / pageIndex
  React.useEffect(() => {
    if (paginationConfig.pageSize) {
      table.setPageSize(paginationConfig.pageSize)
    }
    if (typeof paginationConfig.pageIndex === "number") {
      table.setPageIndex(paginationConfig.pageIndex)
    }
  }, [paginationConfig.pageSize, paginationConfig.pageIndex])

  // 外部 pageIndex 同步
  React.useEffect(() => {
    if (typeof config === "object" && config.pageIndex !== undefined) {
      if (config.pageIndex !== table.getState().pagination.pageIndex) {
        table.setPageIndex(config.pageIndex)
      }
    }
  }, [config, table])

  // 快速跳轉
  const [jumpPage, setJumpPage] = React.useState("")
  const handleJump = () => {
    const page = Number(jumpPage) - 1
    if (page >= 0 && page < totalPages) {
      table.setPageIndex(page)
      paginationConfig.onPageChange?.(page)
      setJumpPage("")
    }
  }

  const currentPage = pageIndexState + 1

  return (
    <div className="flex items-center justify-end px-2">
      {/* {paginationConfig.showTotal && (
        <div className="flex-1 text-sm text-muted-foreground text-left hidden lg:block">
          {selectedItems} {paginationConfig.labels?.total} {totalItems}
        </div>
      )} */}

      <div className="flex items-center space-x-6 lg:space-x-8">
        {/* 每頁大小 */}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">{paginationConfig.labels?.displayItemCount}</p>
          <Select
            value={`${currentSize}`}
            onValueChange={(value) => {
              const newSize = Number(value)
              table.setPageSize(newSize)
              paginationConfig.onPageSizeChange?.(newSize)
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={`${currentSize}`} />
            </SelectTrigger>
            <SelectContent side="top">
              {paginationConfig.pageSizeOptions?.map((ps) => (
                <SelectItem key={ps} value={`${ps}`}>
                  {ps}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 頁碼顯示 */}
        {paginationConfig.showPageNumbers && (
          <div className="hidden w-[100px] items-center justify-center text-sm font-medium sm:flex">
            {paginationConfig.labels?.page} {currentPage} {paginationConfig.labels?.to} {totalPages}
          </div>
        )}

        {/* 分頁按鈕 */}
        <div className="flex items-center space-x-2">
          {paginationConfig.showFirstLastButtons && (
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
              onClick={() => {
                table.setPageIndex(0)
                paginationConfig.onPageChange?.(0)
              }}
              disabled={currentPage <= 1}
            >
              <span className="sr-only">{paginationConfig.labels?.firstPage}</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="outline"
            className="h-8 w-8 p-0 bg-transparent"
            onClick={() => {
              table.previousPage()
              paginationConfig.onPageChange?.(pageIndexState - 1)
            }}
            disabled={currentPage <= 1}
          >
            <span className="sr-only">{paginationConfig.labels?.previousPage}</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 bg-transparent"
            onClick={() => {
              table.nextPage()
              paginationConfig.onPageChange?.(pageIndexState + 1)
            }}
            disabled={currentPage >= totalPages}
          >
            <span className="sr-only">{paginationConfig.labels?.nextPage}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          {paginationConfig.showFirstLastButtons && (
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
              onClick={() => {
                table.setPageIndex(totalPages - 1)
                paginationConfig.onPageChange?.(totalPages - 1)
              }}
              disabled={currentPage >= totalPages}
            >
              <span className="sr-only">{paginationConfig.labels?.lastPage}</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* 快速跳轉 */}
        {paginationConfig.showQuickJumper && (
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              min={1}
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              className="h-8 w-[70px]"
              placeholder={paginationConfig.labels?.jumper}
            />
            <Button variant="link" onClick={handleJump} className="h-8">
              <ArrowRightCircle className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
