"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ui/data-table/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import type { Company } from "@/types/company"
import { MoreHorizontal, Pencil, Trash2, Plus, ArrowLeft, Search } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import CustomerForm from "./customer-form"

// 模擬客戶資料
const mockCustomers: Company[] = [
  {
    id: "1",
    code: "C001",
    name: "台灣科技股份有限公司",
    shortName: "台灣科技",
    lastEditDate: "2024/01/15",
    unifiedNumber: "12345678",
    responsible: "王小明",
    contact: "李小華",
    endDate: "31",
    address: "台北市信義區信義路五段7號",
    taxType: "外加",
    phone: "02-27123456",
    companyPhone: "02-27123457",
    fax: "02-27123458",
    remarks: "重要客戶",
  },
  {
    id: "2",
    code: "C002",
    name: "高雄貿易有限公司",
    shortName: "高雄貿易",
    lastEditDate: "2024/01/14",
    unifiedNumber: "87654321",
    responsible: "陳大明",
    contact: "張小美",
    endDate: "15",
    address: "高雄市前鎮區中山二路123號",
    taxType: "內含",
    phone: "07-12345678",
    companyPhone: "07-12345679",
    fax: "07-12345680",
    remarks: "",
  },
]

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Company[]>(mockCustomers)
  const [currentView, setCurrentView] = useState<"list" | "form">("list")
  const [editingCustomer, setEditingCustomer] = useState<Company | null>(null)
  const [pagination, setPagination] = useState({
    pageSizeOptions: [10, 20, 30, 50],
    pageSize: 10,
    showPageNumbers: true,
    showFirstLastButtons: true,
    showTotal: true,
    showQuickJumper: true,
    labels: {
      displayItemCount: "每頁顯示",
      page: "第",
      to: "頁，共",
      firstPage: "首頁",
      previousPage: "上一頁",
      nextPage: "下一頁",
      lastPage: "末頁",
      total: "筆，共",
      jumper: "跳至",
    },
  })

  // 篩選狀態
  const [filters, setFilters] = useState({
    code: "",
    name: "",
    responsible: "",
    phone: "",
  })

  const handleSearch = () => {
    // 搜尋功能已經透過 useMemo 自動執行，這裡可以加入額外的搜尋邏輯
    console.log("執行搜尋", filters)
  }

  const handleClearSearch = () => {
    setFilters({
      code: "",
      name: "",
      responsible: "",
      phone: "",
    })
  }

  // 篩選後的客戶資料
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      return (
        customer.code.toLowerCase().includes(filters.code.toLowerCase()) &&
        customer.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        customer.responsible.toLowerCase().includes(filters.responsible.toLowerCase()) &&
        customer.phone.toLowerCase().includes(filters.phone.toLowerCase())
      )
    })
  }, [customers, filters])

  // 表格欄位定義
  const columns: ColumnDef<Company>[] = [
    {
      accessorKey: "code",
      header: "編號",
    },
    {
      accessorKey: "name",
      header: "公司名稱",
    },
    {
      accessorKey: "shortName",
      header: "簡稱",
    },
    {
      accessorKey: "responsible",
      header: "負責人",
    },
    {
      accessorKey: "contact",
      header: "聯絡人",
    },
    {
      accessorKey: "phone",
      header: "電話",
    },
    {
      accessorKey: "address",
      header: "地址",
    },
    {
      accessorKey: "taxType",
      header: "稅別",
    },
    {
      accessorKey: "lastEditDate",
      header: "最近編輯日期",
    },
    {
      id: "actions",
      header: "操作",
      cell: ({ row }) => {
        const customer = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(customer)}>
                <Pencil className="mr-2 h-4 w-4" />
                編輯
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(customer.id)} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                刪除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const handleEdit = (customer: Company) => {
    setEditingCustomer(customer)
    setCurrentView("form")
  }

  const handleDelete = (id: string) => {
    if (confirm("確定要刪除此客戶嗎？")) {
      setCustomers(customers.filter((c) => c.id !== id))
    }
  }

  const handleAddNew = () => {
    setEditingCustomer(null)
    setCurrentView("form")
  }

  const handleFormSubmit = (data: any) => {
    if (editingCustomer) {
      // 更新現有客戶
      setCustomers(
        customers.map((c) =>
          c.id === editingCustomer.id ? { ...c, ...data, lastEditDate: new Date().toLocaleDateString("zh-TW") } : c,
        ),
      )
    } else {
      // 新增客戶
      const newCustomer: Company = {
        ...data,
        id: Date.now().toString(),
        lastEditDate: new Date().toLocaleDateString("zh-TW"),
      }
      setCustomers([...customers, newCustomer])
    }
    setCurrentView("list")
    setEditingCustomer(null)
  }

  const handleFormCancel = () => {
    setCurrentView("list")
    setEditingCustomer(null)
  }

  if (currentView === "form") {
    return (
      <div>
        <div className="flex items-center px-6">
          <Button variant="link" onClick={handleFormCancel} className="flex items-center space-x-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            <span>返回客戶列表</span>
          </Button>
        </div>
        <CustomerForm />
      </div>
    )
  }

  return (
    <div className="h-full bg-white p-6 rounded-lg shadow-md flex flex-col">
      {/* <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">客戶管理</h1>
      </div> */}

      <div className="space-y-4 border-b pb-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">編號</label>
            <Input
              placeholder="搜尋編號"
              value={filters.code}
              onChange={(e) => setFilters({ ...filters, code: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">公司名稱</label>
            <Input
              placeholder="搜尋公司名稱"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">負責人</label>
            <Input
              placeholder="搜尋負責人"
              value={filters.responsible}
              onChange={(e) => setFilters({ ...filters, responsible: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">電話</label>
            <Input
              placeholder="搜尋電話"
              value={filters.phone}
              onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
            />
          </div>
          <div className="flex justify-center items-end">
            <Button onClick={handleSearch} className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>搜尋</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>新增客戶</span>
        </Button>
      </div>

      {/* 客戶表格 */}
      <DataTable
        columns={columns}
        data={filteredCustomers}
        pagination={pagination}
      />
    </div>
  )
}
