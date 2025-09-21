"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    ScrollableTabs,
    ScrollableTabsList,
    ScrollableTabsTrigger,
    ScrollableTabsContent,
} from "@/components/ui/scrollable-tabs"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { Plus, Save, Trash2, Search } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { sampleEmissionData } from "@/data/emission-factors"
import type { EmissionItem, Region } from "@/types/emission-factors"

export default function EmissionFactorConfigPage() {
    const [regions, setRegions] = React.useState<Region[]>(sampleEmissionData)
    const [activeTab, setActiveTab] = React.useState("region-1")
    const [isAddRegionOpen, setIsAddRegionOpen] = React.useState(false)
    const [newRegionName, setNewRegionName] = React.useState("")
    const [searchQuery, setSearchQuery] = React.useState("")

    const filteredRegions = React.useMemo(() => {
        if (!searchQuery.trim()) return regions
        return regions.filter((region) => region.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }, [regions, searchQuery])

    React.useEffect(() => {
        if (filteredRegions.length > 0 && !filteredRegions.find((r) => r.id === activeTab)) {
            setActiveTab(filteredRegions[0].id)
        }
    }, [filteredRegions, activeTab])

    const addNewRegion = () => {
        if (!newRegionName.trim()) return

        const newRegionId = `region-${Date.now()}`
        const newRegion: Region = {
            id: newRegionId,
            name: newRegionName.trim(),
            items: [
                {
                    id: `item-1`,
                    substance: "",
                    emissionFactor: "",
                    gwp5: "",
                    gwp6: "",
                },
            ],
        }
        setRegions([...regions, newRegion])
        setActiveTab(newRegionId)
        setIsAddRegionOpen(false)
        setNewRegionName("")
    }

    const addNewItem = (regionId: string) => {
        setRegions(
            regions.map((region) => {
                if (region.id === regionId) {
                    const newItem: EmissionItem = {
                        id: `item-${Date.now()}`,
                        substance: "",
                        emissionFactor: "",
                        gwp5: "",
                        gwp6: "",
                    }
                    return {
                        ...region,
                        items: [...region.items, newItem],
                    }
                }
                return region
            }),
        )
    }

    const deleteItem = (regionId: string, itemId: string) => {
        setRegions(
            regions.map((region) => {
                if (region.id === regionId) {
                    return {
                        ...region,
                        items: region.items.filter((item) => item.id !== itemId),
                    }
                }
                return region
            }),
        )
    }

    const updateItem = (regionId: string, itemId: string, field: keyof EmissionItem, value: string) => {
        setRegions(
            regions.map((region) => {
                if (region.id === regionId) {
                    return {
                        ...region,
                        items: region.items.map((item) => {
                            if (item.id === itemId) {
                                return { ...item, [field]: value }
                            }
                            return item
                        }),
                    }
                }
                return region
            }),
        )
    }

    const saveAll = (regionId: string) => {
        console.log("保存區域:", regionId)
        alert("已保存所有資料")
    }

    const columns: ColumnDef<EmissionItem>[] = [
        {
            accessorKey: "substance",
            header: ({ column }) => (
                <div className="flex justify-center">
                    <DataTableColumnHeader column={column} title="排放物質" />
                </div>
            ),
            cell: ({ row, getValue }) => {
                const regionId = regions.find((r) => r.items.some((item) => item.id === row.original.id))?.id
                return (
                    <div className="text-center">
                        <Input
                            placeholder="請輸入排放物質"
                            value={getValue() as string}
                            onChange={(e) => regionId && updateItem(regionId, row.original.id, "substance", e.target.value)}
                            className="text-center border border-input bg-background hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>
                )
            },
        },
        {
            accessorKey: "emissionFactor",
            header: ({ column }) => (
                <div className="flex justify-center">
                    <DataTableColumnHeader column={column} title="排放係數" />
                </div>
            ),
            cell: ({ row, getValue }) => {
                const regionId = regions.find((r) => r.items.some((item) => item.id === row.original.id))?.id
                return (
                    <div className="text-center">
                        <Input
                            placeholder="請輸入排放係數"
                            value={getValue() as string}
                            onChange={(e) => regionId && updateItem(regionId, row.original.id, "emissionFactor", e.target.value)}
                            className="text-center border border-input bg-background hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>
                )
            },
        },
        {
            accessorKey: "gwp5",
            header: ({ column }) => (
                <div className="flex justify-center">
                    <DataTableColumnHeader column={column} title="GWP5" />
                </div>
            ),
            cell: ({ row, getValue }) => {
                const regionId = regions.find((r) => r.items.some((item) => item.id === row.original.id))?.id
                return (
                    <div className="text-center">
                        <Input
                            placeholder="請輸入GWP5"
                            value={getValue() as string}
                            onChange={(e) => regionId && updateItem(regionId, row.original.id, "gwp5", e.target.value)}
                            className="text-center border border-input bg-background hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>
                )
            },
        },
        {
            accessorKey: "gwp6",
            header: ({ column }) => (
                <div className="flex justify-center">
                    <DataTableColumnHeader column={column} title="GWP6" />
                </div>
            ),
            cell: ({ row, getValue }) => {
                const regionId = regions.find((r) => r.items.some((item) => item.id === row.original.id))?.id
                return (
                    <div className="text-center">
                        <Input
                            placeholder="請輸入GWP6"
                            value={getValue() as string}
                            onChange={(e) => regionId && updateItem(regionId, row.original.id, "gwp6", e.target.value)}
                            className="text-center border border-input bg-background hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>
                )
            },
        },
        {
            id: "actions",
            header: () => <div className="flex justify-center">操作</div>,
            cell: ({ row }) => {
                const regionId = regions.find((r) => r.items.some((item) => item.id === row.original.id))?.id
                const region = regions.find((r) => r.id === regionId)
                return (
                    <div className="text-center">
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => regionId && deleteItem(regionId, row.original.id)}
                            disabled={region?.items.length === 1}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )
            },
        },
    ]

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <div className="mb-6">
                <div className="text-3xl font-bold text-left mb-2">區域排放係數設定</div>
                <p className="text-muted-foreground text-left">管理不同區域的排放物質係數設定</p>
            </div>

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="搜尋區域..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <Dialog open={isAddRegionOpen} onOpenChange={setIsAddRegionOpen}>
                        <DialogTrigger asChild>
                            <Button className="ml-4">
                                <Plus className="h-4 w-4 mr-2" />
                                新增區域
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>新增區域</DialogTitle>
                                <DialogDescription>請輸入新區域的名稱</DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <Input
                                    placeholder="請輸入區域名稱"
                                    value={newRegionName}
                                    onChange={(e) => setNewRegionName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            addNewRegion()
                                        }
                                    }}
                                />
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddRegionOpen(false)}>
                                    取消
                                </Button>
                                <Button onClick={addNewRegion} disabled={!newRegionName.trim()}>
                                    確認新增
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <div>
                    <ScrollableTabs value={activeTab} onValueChange={setActiveTab}>
                        <ScrollableTabsList>
                            {filteredRegions.map((region) => (
                                <ScrollableTabsTrigger key={region.id} value={region.id}>
                                    {region.name}
                                </ScrollableTabsTrigger>
                            ))}
                        </ScrollableTabsList>

                        {filteredRegions.map((region) => (
                            <ScrollableTabsContent key={region.id} value={region.id}>
                                <div className="space-y-4">
                                    <DataTable
                                        columns={columns}
                                        data={region.items}
                                        pagination={true}
                                        disableSelect={true}
                                        showViewOptions={false}
                                        topContent={
                                            <div className="flex justify-end gap-2 mb-4">
                                                <Button onClick={() => addNewItem(region.id)} variant="outline">
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    新增項目
                                                </Button>
                                                <Button onClick={() => saveAll(region.id)}>
                                                    <Save className="h-4 w-4 mr-2" />
                                                    儲存全部
                                                </Button>
                                            </div>
                                        }
                                    />
                                </div>
                            </ScrollableTabsContent>
                        ))}
                    </ScrollableTabs>
                </div>
            </div>
        </div>
    )
}
