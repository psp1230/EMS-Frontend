"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { FormDialog } from "./form-dialog"
import { CompanyForm } from "./company-form"
import { ContactForm } from "./contact-form"
import { CustomsBrokerForm } from "./customs-broker-form"
import { ContainerLocationForm } from "./container-location-form"
import { VendorForm } from "./vendor-form"
import type { Company, Contact, CustomsBroker, ContainerLocation, Vendor } from "@/types/company"

export default function CustomerForm() {
  const [company, setCompany] = useState<Company>({
    id: "1",
    code: "2202",
    name: "發發舒緩股份有限公司",
    shortName: "發發舒緩",
    lastEditDate: "111/12/26",
    unifiedNumber: "59301299",
    responsible: "",
    contact: "",
    endDate: "31",
    address: "台北市延平北路二段202號16樓",
    taxType: "外加",
    phone: "02-25529686",
    companyPhone: "02-25529689",
    fax: "103 台北市延平北路二段202號16樓",
    remarks: "海發舒緩工業股份有限公司#59306816",
  })

  const [contacts, setContacts] = useState<Contact[]>([{ id: "1", name: "劉庭", phone: "02-25817185" }])

  const [customsBrokers, setCustomsBrokers] = useState<CustomsBroker[]>([
    { id: "1", name: "海運報關行", phone: "02-25817185", fax: "2562-4108", contactPerson: "周小姐" },
  ])

  const [containerLocations, setContainerLocations] = useState<ContainerLocation[]>([
    {
      id: "1",
      location: "主要倉庫",
      doorDirection: "左開",
      address: "中壢區中華路2段116號",
      phone: "03-3341235",
      contactPerson: "張先生",
    },
  ])

  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: "1",
      name: "供應商A",
      phone: "02-12345678",
      fax: "02-87654321",
      unifiedNumber: "12345678",
      email: "vendor@example.com",
      createdDate: new Date(),
    },
  ])

  // 彈窗狀態
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [customsBrokerDialogOpen, setCustomsBrokerDialogOpen] = useState(false)
  const [containerLocationDialogOpen, setContainerLocationDialogOpen] = useState(false)
  const [vendorDialogOpen, setVendorDialogOpen] = useState(false)

  // 編輯狀態
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [editingCustomsBroker, setEditingCustomsBroker] = useState<CustomsBroker | null>(null)
  const [editingContainerLocation, setEditingContainerLocation] = useState<ContainerLocation | null>(null)
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)

  const contactColumns: ColumnDef<Contact>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="接洽人" />,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => <DataTableColumnHeader column={column} title="電話" />,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const contact = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setEditingContact(contact)
                  setContactDialogOpen(true)
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                編輯
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setContacts(contacts.filter((c) => c.id !== contact.id))
                }}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                刪除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const customsBrokerColumns: ColumnDef<CustomsBroker>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="報關行" />,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => <DataTableColumnHeader column={column} title="電話" />,
    },
    {
      accessorKey: "fax",
      header: ({ column }) => <DataTableColumnHeader column={column} title="傳真" />,
    },
    {
      accessorKey: "contactPerson",
      header: ({ column }) => <DataTableColumnHeader column={column} title="聯絡人" />,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const broker = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setEditingCustomsBroker(broker)
                  setCustomsBrokerDialogOpen(true)
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                編輯
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setCustomsBrokers(customsBrokers.filter((b) => b.id !== broker.id))
                }}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                刪除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const containerLocationColumns: ColumnDef<ContainerLocation>[] = [
    {
      accessorKey: "location",
      header: ({ column }) => <DataTableColumnHeader column={column} title="送櫃地點" />,
    },
    {
      accessorKey: "doorDirection",
      header: ({ column }) => <DataTableColumnHeader column={column} title="櫃門方向" />,
    },
    {
      accessorKey: "address",
      header: ({ column }) => <DataTableColumnHeader column={column} title="裝卸地址" />,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => <DataTableColumnHeader column={column} title="電話" />,
    },
    {
      accessorKey: "contactPerson",
      header: ({ column }) => <DataTableColumnHeader column={column} title="聯絡人" />,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const location = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setEditingContainerLocation(location)
                  setContainerLocationDialogOpen(true)
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                編輯
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setContainerLocations(containerLocations.filter((l) => l.id !== location.id))
                }}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                刪除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const vendorColumns: ColumnDef<Vendor>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="廠商" />,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => <DataTableColumnHeader column={column} title="電話" />,
    },
    {
      accessorKey: "fax",
      header: ({ column }) => <DataTableColumnHeader column={column} title="傳真" />,
    },
    {
      accessorKey: "unifiedNumber",
      header: ({ column }) => <DataTableColumnHeader column={column} title="統一編號" />,
    },
    {
      accessorKey: "email",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    },
    {
      accessorKey: "createdDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="建檔日期" />,
      cell: ({ row }) => {
        const date = row.getValue("createdDate") as Date
        return date.toLocaleDateString("zh-TW")
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const vendor = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setEditingVendor(vendor)
                  setVendorDialogOpen(true)
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                編輯
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setVendors(vendors.filter((v) => v.id !== vendor.id))
                }}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                刪除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const handleCompanySubmit = (data: any) => {
    setCompany({ ...company, ...data, lastEditDate: new Date().toLocaleDateString("zh-TW") })
  }

  const handleContactSubmit = (data: any) => {
    if (editingContact) {
      setContacts(contacts.map((c) => (c.id === editingContact.id ? { ...c, ...data } : c)))
      setEditingContact(null)
    } else {
      setContacts([...contacts, { ...data, id: Date.now().toString() }])
    }
    setContactDialogOpen(false)
  }

  const handleCustomsBrokerSubmit = (data: any) => {
    if (editingCustomsBroker) {
      setCustomsBrokers(customsBrokers.map((b) => (b.id === editingCustomsBroker.id ? { ...b, ...data } : b)))
      setEditingCustomsBroker(null)
    } else {
      setCustomsBrokers([...customsBrokers, { ...data, id: Date.now().toString() }])
    }
    setCustomsBrokerDialogOpen(false)
  }

  const handleContainerLocationSubmit = (data: any) => {
    if (editingContainerLocation) {
      setContainerLocations(
        containerLocations.map((l) => (l.id === editingContainerLocation.id ? { ...l, ...data } : l)),
      )
      setEditingContainerLocation(null)
    } else {
      setContainerLocations([...containerLocations, { ...data, id: Date.now().toString() }])
    }
    setContainerLocationDialogOpen(false)
  }

  const handleVendorSubmit = (data: any) => {
    if (editingVendor) {
      setVendors(vendors.map((v) => (v.id === editingVendor.id ? { ...v, ...data } : v)))
      setEditingVendor(null)
    } else {
      setVendors([...vendors, { ...data, id: Date.now().toString() }])
    }
    setVendorDialogOpen(false)
  }

  const handleDialogClose = (dialogType: string) => {
    switch (dialogType) {
      case "contact":
        setContactDialogOpen(false)
        setEditingContact(null)
        break
      case "customsBroker":
        setCustomsBrokerDialogOpen(false)
        setEditingCustomsBroker(null)
        break
      case "containerLocation":
        setContainerLocationDialogOpen(false)
        setEditingContainerLocation(null)
        break
      case "vendor":
        setVendorDialogOpen(false)
        setEditingVendor(null)
        break
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardContent>
          <CompanyForm initialData={company} onSubmit={handleCompanySubmit} onCancel={() => { }} />
        </CardContent>
      </Card>

      <div className="space-y-6">
        {/* 接洽人表格 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>接洽人</CardTitle>
            <Button
              size="sm"
              onClick={() => {
                setEditingContact(null)
                setContactDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              新增接洽人
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable columns={contactColumns} data={contacts} pagination={{ pageSize: 5 }} />
          </CardContent>
        </Card>

        {/* 報關行表格 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>報關行</CardTitle>
            <Button
              size="sm"
              onClick={() => {
                setEditingCustomsBroker(null)
                setCustomsBrokerDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              新增報關行
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable columns={customsBrokerColumns} data={customsBrokers} pagination={{ pageSize: 5 }} />
          </CardContent>
        </Card>

        {/* 送櫃地點表格 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>送櫃地點</CardTitle>
            <Button
              size="sm"
              onClick={() => {
                setEditingContainerLocation(null)
                setContainerLocationDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              新增地點
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable columns={containerLocationColumns} data={containerLocations} pagination={{ pageSize: 5 }} />
          </CardContent>
        </Card>

        {/* 廠商表格 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>廠商</CardTitle>
            <Button
              size="sm"
              onClick={() => {
                setEditingVendor(null)
                setVendorDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              新增廠商
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable columns={vendorColumns} data={vendors} pagination={{ pageSize: 5 }} />
          </CardContent>
        </Card>
      </div>

      <FormDialog
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
        title={editingContact ? "編輯接洽人" : "新增接洽人"}
      >
        <ContactForm
          initialData={editingContact || undefined}
          onSubmit={handleContactSubmit}
          onCancel={() => handleDialogClose("contact")}
        />
      </FormDialog>

      <FormDialog
        open={customsBrokerDialogOpen}
        onOpenChange={setCustomsBrokerDialogOpen}
        title={editingCustomsBroker ? "編輯報關行" : "新增報關行"}
      >
        <CustomsBrokerForm
          initialData={editingCustomsBroker || undefined}
          onSubmit={handleCustomsBrokerSubmit}
          onCancel={() => handleDialogClose("customsBroker")}
        />
      </FormDialog>

      <FormDialog
        open={containerLocationDialogOpen}
        onOpenChange={setContainerLocationDialogOpen}
        title={editingContainerLocation ? "編輯送櫃地點" : "新增送櫃地點"}
      >
        <ContainerLocationForm
          initialData={editingContainerLocation || undefined}
          onSubmit={handleContainerLocationSubmit}
          onCancel={() => handleDialogClose("containerLocation")}
        />
      </FormDialog>

      <FormDialog
        open={vendorDialogOpen}
        onOpenChange={setVendorDialogOpen}
        title={editingVendor ? "編輯廠商" : "新增廠商"}
      >
        <VendorForm
          initialData={editingVendor || undefined}
          onSubmit={handleVendorSubmit}
          onCancel={() => handleDialogClose("vendor")}
        />
      </FormDialog>
    </div>
  )
}
