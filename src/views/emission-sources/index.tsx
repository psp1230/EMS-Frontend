"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2 } from "lucide-react"

interface EmissionSource {
    id: string
    name: string
}

export default function EmissionSourcesPage() {
    const [emissionSources, setEmissionSources] = useState<EmissionSource[]>([
        { id: "1", name: "固定燃燒源" },
        { id: "2", name: "移動燃燒源" },
        { id: "3", name: "工業製程" },
        { id: "4", name: "溶劑使用" },
        { id: "5", name: "廢棄物處理" },
    ])

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingSource, setEditingSource] = useState<EmissionSource | null>(null)
    const [sourceName, setSourceName] = useState("")

    const handleAdd = () => {
        setEditingSource(null)
        setSourceName("")
        setIsDialogOpen(true)
    }

    const handleEdit = (source: EmissionSource) => {
        setEditingSource(source)
        setSourceName(source.name)
        setIsDialogOpen(true)
    }

    const handleSave = () => {
        if (!sourceName.trim()) return

        if (editingSource) {
            // 編輯現有項目
            setEmissionSources((prev) =>
                prev.map((source) => (source.id === editingSource.id ? { ...source, name: sourceName.trim() } : source)),
            )
        } else {
            // 新增項目
            const newSource: EmissionSource = {
                id: Date.now().toString(),
                name: sourceName.trim(),
            }
            setEmissionSources((prev) => [...prev, newSource])
        }

        setIsDialogOpen(false)
        setSourceName("")
        setEditingSource(null)
    }

    const handleDelete = (id: string) => {
        setEmissionSources((prev) => prev.filter((source) => source.id !== id))
    }

    return (
        <div className="container mx-auto max-w-6xl p-6">
            <div className="mb-6">
                <div className="text-2xl font-bold text-left mb-4">排放源鑑別設定</div>
                <div className="flex justify-between items-center mb-4">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={handleAdd} className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                新增排放源
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{editingSource ? "編輯排放源" : "新增排放源"}</DialogTitle>
                                <DialogDescription>請輸入排放源名稱</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        排放源名稱
                                    </Label>
                                    <Input
                                        id="name"
                                        value={sourceName}
                                        onChange={(e) => setSourceName(e.target.value)}
                                        className="col-span-3"
                                        placeholder="請輸入排放源名稱"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    取消
                                </Button>
                                <Button type="submit" onClick={handleSave}>
                                    {editingSource ? "更新" : "新增"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-center">排放源名稱</TableHead>
                                <TableHead className="text-center w-32">操作</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {emissionSources.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                                        暫無資料
                                    </TableCell>
                                </TableRow>
                            ) : (
                                emissionSources.map((source) => (
                                    <TableRow key={source.id}>
                                        <TableCell className="text-center">{source.name}</TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center gap-2">
                                                <Button variant="outline" size="sm" onClick={() => handleEdit(source)} className="h-8 w-8 p-0">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(source.id)}
                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
