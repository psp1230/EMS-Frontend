"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    ScrollableTabs,
    ScrollableTabsList,
    ScrollableTabsTrigger,
    ScrollableTabsContent,
} from "@/components/ui/scrollable-tabs"
import { DataTable } from "@/components/ui/data-table/data-table"
import { Trash2, Plus } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import type { Scope3EmissionItem, Scope3Item } from "@/types/scope3"
import { sampleScope3EmissionData, sampleScope3ItemData } from "@/data/scope3"

export default function Scope3SettingsPage() {
    const [activeTab, setActiveTab] = useState("emission-factors")

    const [emissionItems, setEmissionItems] = useState<Scope3EmissionItem[]>(sampleScope3EmissionData)
    const [scope3Items, setScope3Items] = useState<Scope3Item[]>(sampleScope3ItemData)

    const emissionColumns: ColumnDef<Scope3EmissionItem>[] = [
        {
            accessorKey: "substance",
            header: () => <div className="text-center">排放物質</div>,
            cell: ({ row }) => {
                const item = row.original
                return (
                    <div className="text-center">
                        <Input
                            value={item.substance}
                            onChange={(e) => updateEmissionItem(item.id, "substance", e.target.value)}
                            className="text-center border-gray-300 bg-white"
                            placeholder="請輸入排放物質"
                        />
                    </div>
                )
            },
        },
        {
            accessorKey: "factor",
            header: () => <div className="text-center">排放係數</div>,
            cell: ({ row }) => {
                const item = row.original
                return (
                    <div className="text-center">
                        <Input
                            value={item.factor}
                            onChange={(e) => updateEmissionItem(item.id, "factor", e.target.value)}
                            className="text-center border-gray-300 bg-white"
                            placeholder="請輸入排放係數"
                            type="number"
                            step="0.01"
                        />
                    </div>
                )
            },
        },
        {
            id: "actions",
            header: () => <div className="text-center">操作</div>,
            cell: ({ row }) => {
                const item = row.original
                return (
                    <div className="text-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteEmissionItem(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )
            },
        },
    ]

    const scope3ItemColumns: ColumnDef<Scope3Item>[] = [
        {
            accessorKey: "item",
            header: () => <div className="text-center">項目</div>,
            cell: ({ row }) => {
                const item = row.original
                return (
                    <div className="text-center">
                        <Input
                            value={item.item}
                            onChange={(e) => updateScope3Item(item.id, "item", e.target.value)}
                            className="text-center border-gray-300 bg-white"
                            placeholder="請輸入項目名稱"
                        />
                    </div>
                )
            },
        },
        {
            accessorKey: "factor",
            header: () => <div className="text-center">排放係數</div>,
            cell: ({ row }) => {
                const item = row.original
                return (
                    <div className="text-center">
                        <Input
                            value={item.factor}
                            onChange={(e) => updateScope3Item(item.id, "factor", e.target.value)}
                            className="text-center border-gray-300 bg-white"
                            placeholder="請輸入排放係數"
                            type="number"
                            step="0.01"
                        />
                    </div>
                )
            },
        },
        {
            id: "actions",
            header: () => <div className="text-center">操作</div>,
            cell: ({ row }) => {
                const item = row.original
                return (
                    <div className="text-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteScope3Item(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )
            },
        },
    ]

    // Emission factors functions
    const addEmissionItem = () => {
        const newItem: Scope3EmissionItem = {
            id: Date.now().toString(),
            substance: "",
            factor: "",
        }
        setEmissionItems([...emissionItems, newItem])
    }

    const updateEmissionItem = (id: string, field: keyof Scope3EmissionItem, value: string) => {
        setEmissionItems((items) => items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
    }

    const deleteEmissionItem = (id: string) => {
        setEmissionItems((items) => items.filter((item) => item.id !== id))
    }

    const saveAllEmissionItems = () => {
        console.log("Saving emission items:", emissionItems)
        // Here you would typically save to backend
    }

    // Scope3 items functions
    const addScope3Item = () => {
        const newItem: Scope3Item = {
            id: Date.now().toString(),
            item: "",
            factor: "",
        }
        setScope3Items([...scope3Items, newItem])
    }

    const updateScope3Item = (id: string, field: keyof Scope3Item, value: string) => {
        setScope3Items((items) => items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
    }

    const deleteScope3Item = (id: string) => {
        setScope3Items((items) => items.filter((item) => item.id !== id))
    }

    const saveAllScope3Items = () => {
        console.log("Saving scope3 items:", scope3Items)
        // Here you would typically save to backend
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl space-y-6">
            <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-left">Scope3 係數設定</div>
            </div>

            <ScrollableTabs value={activeTab} onValueChange={setActiveTab}>
                <ScrollableTabsList>
                    <ScrollableTabsTrigger value="emission-factors">Scope3 排放係數</ScrollableTabsTrigger>
                    <ScrollableTabsTrigger value="scope3-items">Scope3 項目</ScrollableTabsTrigger>
                </ScrollableTabsList>

                <ScrollableTabsContent value="emission-factors">
                    <div className="space-y-4">
                        <div className="flex justify-end gap-2">
                            <Button onClick={addEmissionItem} className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                新增項目
                            </Button>
                            <Button onClick={saveAllEmissionItems} variant="default">
                                儲存全部
                            </Button>
                        </div>

                        <DataTable
                            columns={emissionColumns}
                            data={emissionItems}
                            pagination={true}
                        />
                    </div>
                </ScrollableTabsContent>

                <ScrollableTabsContent value="scope3-items">
                    <div className="space-y-4">
                        <div className="flex justify-end gap-2">
                            <Button onClick={addScope3Item} className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                新增項目
                            </Button>
                            <Button onClick={saveAllScope3Items} variant="default">
                                儲存全部
                            </Button>
                        </div>

                        <DataTable
                            columns={scope3ItemColumns}
                            data={scope3Items}
                            pagination={true}
                        />
                    </div>
                </ScrollableTabsContent>
            </ScrollableTabs>
        </div>
    )
}
