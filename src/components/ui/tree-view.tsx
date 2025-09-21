"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronRight, Edit2, Plus, Check, X, Trash2, MoreHorizontal } from "lucide-react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

const treeVariants = cva(
    "group hover:before:opacity-100 before:absolute before:rounded-lg before:left-0 px-2 before:w-full before:opacity-0 before:bg-slate-25 dark:before:bg-slate-800/30 before:h-[2rem] before:-z-10",
)

const selectedTreeVariants = cva(
    "before:opacity-100 before:bg-slate-50 dark:before:bg-slate-800/50 text-slate-900 dark:text-slate-100 font-medium before:-z-20",
)

interface TreeDataItem {
    id: string
    name: string
    icon?: any
    selectedIcon?: any
    openIcon?: any
    children?: TreeDataItem[]
    actions?: React.ReactNode
    onClick?: () => void
    onDoubleClick?: () => void
    // 節點級別的操作函數
    onEdit?: (itemId: string, newName: string) => void
    onAddChild?: (parentId: string, childName: string) => void
    onDelete?: (itemId: string) => void
    // 控制哪些操作可用
    canEdit?: boolean
    canAddChild?: boolean
    canDelete?: boolean
}

type ActionRenderer = (item: TreeDataItem) => React.ReactNode

type TreeProps = React.HTMLAttributes<HTMLDivElement> & {
    data: TreeDataItem[] | TreeDataItem
    initialSelectedItemId?: string
    onSelectChange?: (item: TreeDataItem | undefined) => void
    // 全局回調函數（可選，如果節點沒有自己的函數時使用）
    onEditName?: (itemId: string, newName: string) => void
    onAddChild?: (parentId: string, childName: string) => void
    onDeleteItem?: (itemId: string) => void
    expandAll?: boolean
    disabled?: boolean
    defaultNodeIcon?: any
    defaultLeafIcon?: any
    // 全局控制（當節點沒有指定時的默認值）
    defaultCanEdit?: boolean
    defaultCanAddChild?: boolean
    defaultCanDelete?: boolean
    // 預設 actions 相關
    defaultActions?: React.ReactNode
    actionRenderer?: ActionRenderer
    // 控制 actions 顯示行為
    showActions?: boolean // 新增：全局控制是否顯示 actions
    showActionsOnHover?: boolean
    leafShowActionsOnHover?: boolean
}

const TreeView = React.forwardRef<HTMLDivElement, TreeProps>(
    (
        {
            data,
            initialSelectedItemId,
            onSelectChange,
            onEditName,
            onAddChild,
            onDeleteItem,
            expandAll,
            defaultLeafIcon,
            defaultNodeIcon,
            defaultCanEdit = true,
            defaultCanAddChild = true,
            defaultCanDelete = true,
            defaultActions,
            actionRenderer,
            showActions = false, // 新增：默認隱藏 actions
            showActionsOnHover = true,
            leafShowActionsOnHover = false,
            className,
            ...props
        },
        ref,
    ) => {
        const [selectedItemId, setSelectedItemId] = React.useState<string | undefined>(initialSelectedItemId)
        const [editingItemId, setEditingItemId] = React.useState<string | undefined>()
        const [editingName, setEditingName] = React.useState<string>("")
        const [addChildDialogOpen, setAddChildDialogOpen] = React.useState(false)
        const [addChildParentId, setAddChildParentId] = React.useState<string>("")
        const [addChildParentName, setAddChildParentName] = React.useState<string>("")
        const [newChildName, setNewChildName] = React.useState<string>("")
        const [currentAddChildHandler, setCurrentAddChildHandler] = React.useState<
            ((parentId: string, childName: string) => void) | null
        >(null)

        // 在現有狀態後添加
        const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
        const [deleteItemId, setDeleteItemId] = React.useState<string>("")
        const [deleteItemName, setDeleteItemName] = React.useState<string>("")
        const [currentDeleteHandler, setCurrentDeleteHandler] = React.useState<((itemId: string) => void) | null>(null)

        // 輔助函數：根據 ID 找到對應的 item
        const findItemById = React.useCallback(
            (items: TreeDataItem[] | TreeDataItem, targetId: string): TreeDataItem | null => {
                if (items instanceof Array) {
                    for (const item of items) {
                        if (item.id === targetId) return item
                        if (item.children) {
                            const found = findItemById(item.children, targetId)
                            if (found) return found
                        }
                    }
                } else if (items.id === targetId) {
                    return items
                } else if (items.children) {
                    return findItemById(items.children, targetId)
                }
                return null
            },
            [],
        )

        const handleSelectChange = React.useCallback(
            (item: TreeDataItem | undefined) => {
                setSelectedItemId(item?.id)
                if (onSelectChange) {
                    onSelectChange(item)
                }
            },
            [onSelectChange],
        )

        const handleStartEdit = React.useCallback((item: TreeDataItem) => {
            setEditingItemId(item.id)
            setEditingName(item.name)
        }, [])

        const handleSaveEdit = React.useCallback(
            (item: TreeDataItem) => {
                if (editingItemId && editingName.trim()) {
                    // 優先使用節點級別的函數，否則使用全局函數
                    const editHandler = item.onEdit || onEditName
                    if (editHandler) {
                        editHandler(editingItemId, editingName.trim())
                    }
                }
                setEditingItemId(undefined)
                setEditingName("")
            },
            [editingItemId, editingName, onEditName],
        )

        const handleCancelEdit = React.useCallback(() => {
            setEditingItemId(undefined)
            setEditingName("")
        }, [])

        const handleOpenAddChildDialog = React.useCallback(
            (item: TreeDataItem) => {
                setAddChildParentId(item.id)
                setAddChildParentName(item.name)
                setNewChildName("")
                // 保存當前要使用的添加子項目處理函數
                setCurrentAddChildHandler(() => item.onAddChild || onAddChild)
                setAddChildDialogOpen(true)
            },
            [onAddChild],
        )

        const handleAddChild = React.useCallback(() => {
            if (addChildParentId && newChildName.trim() && currentAddChildHandler) {
                currentAddChildHandler(addChildParentId, newChildName.trim())
                setAddChildDialogOpen(false)
                setAddChildParentId("")
                setAddChildParentName("")
                setNewChildName("")
                setCurrentAddChildHandler(null)
            }
        }, [addChildParentId, newChildName, currentAddChildHandler])

        const handleCancelAddChild = React.useCallback(() => {
            setAddChildDialogOpen(false)
            setAddChildParentId("")
            setAddChildParentName("")
            setNewChildName("")
            setCurrentAddChildHandler(null)
        }, [])

        const handleDeleteItem = React.useCallback(
            (itemId: string) => {
                // 找到對應的 item 來獲取名稱和處理函數
                const item = findItemById(data, itemId)
                const itemName = item?.name || "未知項目"

                // 設置對話框狀態
                setDeleteItemId(itemId)
                setDeleteItemName(itemName)

                // 保存當前要使用的刪除處理函數
                const deleteHandler = item?.onDelete || onDeleteItem
                setCurrentDeleteHandler(() => deleteHandler)

                // 打開確認對話框
                setDeleteDialogOpen(true)
            },
            [data, findItemById, onDeleteItem],
        )

        const handleConfirmDelete = React.useCallback(() => {
            if (deleteItemId && currentDeleteHandler) {
                currentDeleteHandler(deleteItemId)

                // 如果刪除的是當前選中的項目，清除選中狀態
                if (selectedItemId === deleteItemId) {
                    setSelectedItemId(undefined)
                }
            }

            // 重置對話框狀態
            setDeleteDialogOpen(false)
            setDeleteItemId("")
            setDeleteItemName("")
            setCurrentDeleteHandler(null)
        }, [deleteItemId, currentDeleteHandler, selectedItemId])

        const handleCancelDelete = React.useCallback(() => {
            setDeleteDialogOpen(false)
            setDeleteItemId("")
            setDeleteItemName("")
            setCurrentDeleteHandler(null)
        }, [])

        const expandedItemIds = React.useMemo(() => {
            if (!initialSelectedItemId) {
                return [] as string[]
            }

            const ids: string[] = []

            function walkTreeItems(items: TreeDataItem[] | TreeDataItem, targetId: string) {
                if (items instanceof Array) {
                    for (let i = 0; i < items.length; i++) {
                        ids.push(items[i]!.id)
                        if (walkTreeItems(items[i]!, targetId) && !expandAll) {
                            return true
                        }
                        if (!expandAll) ids.pop()
                    }
                } else if (!expandAll && items.id === targetId) {
                    return true
                } else if (items.children) {
                    return walkTreeItems(items.children, targetId)
                }
            }

            walkTreeItems(data, initialSelectedItemId)
            return ids
        }, [data, expandAll, initialSelectedItemId])

        return (
            <>
                <div className={cn("overflow-hidden relative p-2", className)}>
                    <TreeItem
                        data={data}
                        ref={ref}
                        selectedItemId={selectedItemId}
                        handleSelectChange={handleSelectChange}
                        expandedItemIds={expandedItemIds}
                        defaultLeafIcon={defaultLeafIcon}
                        defaultNodeIcon={defaultNodeIcon}
                        editingItemId={editingItemId}
                        editingName={editingName}
                        setEditingName={setEditingName}
                        onStartEdit={handleStartEdit}
                        onSaveEdit={handleSaveEdit}
                        onCancelEdit={handleCancelEdit}
                        onOpenAddChildDialog={handleOpenAddChildDialog}
                        onDeleteItem={handleDeleteItem}
                        defaultCanEdit={defaultCanEdit}
                        defaultCanAddChild={defaultCanAddChild}
                        defaultCanDelete={defaultCanDelete}
                        defaultActions={defaultActions}
                        actionRenderer={actionRenderer}
                        showActions={showActions} // 新增
                        showActionsOnHover={showActionsOnHover}
                        leafShowActionsOnHover={leafShowActionsOnHover}
                        {...props}
                    />
                </div>

                {/* 新增子項目對話框 */}
                <Dialog open={addChildDialogOpen} onOpenChange={setAddChildDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>新增子項目</DialogTitle>
                            <DialogDescription>為 "{addChildParentName}" 新增一個子項目</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="child-name" className="text-right">
                                    名稱
                                </Label>
                                <Input
                                    id="child-name"
                                    value={newChildName}
                                    onChange={(e) => setNewChildName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && newChildName.trim()) {
                                            handleAddChild()
                                        } else if (e.key === "Escape") {
                                            handleCancelAddChild()
                                        }
                                    }}
                                    className="col-span-3"
                                    placeholder="請輸入子項目名稱"
                                    autoFocus
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={handleCancelAddChild}>
                                取消
                            </Button>
                            <Button onClick={handleAddChild} disabled={!newChildName.trim()}>
                                新增
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* 刪除確認對話框 */}
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>確認刪除</DialogTitle>
                            <DialogDescription>您確定要刪除 "{deleteItemName}" 嗎？此操作無法撤銷。</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={handleCancelDelete}>
                                取消
                            </Button>
                            <Button variant="destructive" onClick={handleConfirmDelete}>
                                確認刪除
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </>
        )
    },
)
TreeView.displayName = "TreeView"

type TreeItemProps = TreeProps & {
    selectedItemId?: string
    handleSelectChange: (item: TreeDataItem | undefined) => void
    expandedItemIds: string[]
    defaultNodeIcon?: any
    defaultLeafIcon?: any
    editingItemId?: string
    editingName: string
    setEditingName: (name: string) => void
    onStartEdit: (item: TreeDataItem) => void
    onSaveEdit: (item: TreeDataItem) => void
    onCancelEdit: () => void
    onOpenAddChildDialog: (item: TreeDataItem) => void
    onDeleteItem: (itemId: string) => void
    defaultCanEdit: boolean
    defaultCanAddChild: boolean
    defaultCanDelete: boolean
    defaultActions?: React.ReactNode
    actionRenderer?: ActionRenderer
    showActions: boolean // 新增
    showActionsOnHover: boolean
    leafShowActionsOnHover: boolean
}

const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(
    (
        {
            className,
            data,
            selectedItemId,
            handleSelectChange,
            expandedItemIds,
            defaultNodeIcon,
            defaultLeafIcon,
            editingItemId,
            editingName,
            setEditingName,
            onStartEdit,
            onSaveEdit,
            onCancelEdit,
            onOpenAddChildDialog,
            onDeleteItem,
            defaultCanEdit,
            defaultCanAddChild,
            defaultCanDelete,
            defaultActions,
            actionRenderer,
            showActions,
            showActionsOnHover,
            leafShowActionsOnHover,
            ...props
        },
        ref,
    ) => {
        if (!(data instanceof Array)) {
            data = [data]
        }
        return (
            <div ref={ref} role="tree" className={className} {...props}>
                <ul className="my-0">
                    {data.map((item) => (
                        <li key={item.id}>
                            {item.children ? (
                                <TreeNode
                                    item={item}
                                    selectedItemId={selectedItemId}
                                    expandedItemIds={expandedItemIds}
                                    handleSelectChange={handleSelectChange}
                                    defaultNodeIcon={defaultNodeIcon}
                                    defaultLeafIcon={defaultLeafIcon}
                                    editingItemId={editingItemId}
                                    editingName={editingName}
                                    setEditingName={setEditingName}
                                    onStartEdit={onStartEdit}
                                    onSaveEdit={onSaveEdit}
                                    onCancelEdit={onCancelEdit}
                                    onOpenAddChildDialog={onOpenAddChildDialog}
                                    onDeleteItem={onDeleteItem}
                                    defaultCanEdit={defaultCanEdit}
                                    defaultCanAddChild={defaultCanAddChild}
                                    defaultCanDelete={defaultCanDelete}
                                    defaultActions={defaultActions}
                                    actionRenderer={actionRenderer}
                                    showActions={showActions} // 新增
                                    showActionsOnHover={showActionsOnHover}
                                    leafShowActionsOnHover={leafShowActionsOnHover}
                                />
                            ) : (
                                <TreeLeaf
                                    item={item}
                                    selectedItemId={selectedItemId}
                                    handleSelectChange={handleSelectChange}
                                    defaultLeafIcon={defaultLeafIcon}
                                    editingItemId={editingItemId}
                                    editingName={editingName}
                                    setEditingName={setEditingName}
                                    onStartEdit={onStartEdit}
                                    onSaveEdit={onSaveEdit}
                                    onCancelEdit={onCancelEdit}
                                    onOpenAddChildDialog={onOpenAddChildDialog}
                                    onDeleteItem={onDeleteItem}
                                    defaultCanEdit={defaultCanEdit}
                                    defaultCanAddChild={defaultCanAddChild}
                                    defaultCanDelete={defaultCanDelete}
                                    defaultActions={defaultActions}
                                    actionRenderer={actionRenderer}
                                    showActions={showActions} // 新增
                                    showActionsOnHover={leafShowActionsOnHover}
                                    leafShowActionsOnHover={leafShowActionsOnHover}
                                />
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        )
    },
)
TreeItem.displayName = "TreeItem"

const TreeNode = ({
    item,
    handleSelectChange,
    expandedItemIds,
    selectedItemId,
    defaultNodeIcon,
    defaultLeafIcon,
    editingItemId,
    editingName,
    setEditingName,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    onOpenAddChildDialog,
    onDeleteItem,
    defaultCanEdit,
    defaultCanAddChild,
    defaultCanDelete,
    defaultActions,
    actionRenderer,
    showActions,
    showActionsOnHover,
    leafShowActionsOnHover,
}: {
    item: TreeDataItem
    handleSelectChange: (item: TreeDataItem | undefined) => void
    expandedItemIds: string[]
    selectedItemId?: string
    defaultNodeIcon?: any
    defaultLeafIcon?: any
    editingItemId?: string
    editingName: string
    setEditingName: (name: string) => void
    onStartEdit: (item: TreeDataItem) => void
    onSaveEdit: (item: TreeDataItem) => void
    onCancelEdit: () => void
    onOpenAddChildDialog: (item: TreeDataItem) => void
    onDeleteItem: (itemId: string) => void
    defaultCanEdit: boolean
    defaultCanAddChild: boolean
    defaultCanDelete: boolean
    defaultActions?: React.ReactNode
    actionRenderer?: ActionRenderer
    showActions: boolean
    showActionsOnHover: boolean
    leafShowActionsOnHover: boolean
}) => {
    const [value, setValue] = React.useState(expandedItemIds.includes(item.id) ? [item.id] : [])
    const isEditing = editingItemId === item.id

    const hasChildren = item.children && item.children.length > 0

    if (!hasChildren) {
        return (
            <TreeLeaf
                item={item}
                selectedItemId={selectedItemId}
                handleSelectChange={handleSelectChange}
                defaultLeafIcon={defaultLeafIcon}
                editingItemId={editingItemId}
                editingName={editingName}
                setEditingName={setEditingName}
                onStartEdit={onStartEdit}
                onSaveEdit={onSaveEdit}
                onCancelEdit={onCancelEdit}
                onOpenAddChildDialog={onOpenAddChildDialog}
                onDeleteItem={onDeleteItem}
                defaultCanEdit={defaultCanEdit}
                defaultCanAddChild={defaultCanAddChild}
                defaultCanDelete={defaultCanDelete}
                defaultActions={defaultActions}
                actionRenderer={actionRenderer}
                showActions={showActions}
                showActionsOnHover={leafShowActionsOnHover}
                leafShowActionsOnHover={leafShowActionsOnHover}
            />
        )
    }

    return (
        <AccordionPrimitive.Root type="multiple" value={value} onValueChange={(s) => setValue(s)}>
            <AccordionPrimitive.Item value={item.id}>
                <AccordionPrimitive.Header
                    className={cn(
                        "flex flex-1 w-full items-center py-2",
                        treeVariants(),
                        selectedItemId === item.id && selectedTreeVariants(),
                    )}
                >
                    <AccordionPrimitive.Trigger className="transition-all first:[&[data-state=open]>svg]:rotate-90">
                        <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 text-accent-foreground/50 mr-1" />
                    </AccordionPrimitive.Trigger>
                    <TreeIcon
                        item={item}
                        isSelected={selectedItemId === item.id}
                        isOpen={value.includes(item.id)}
                        default={defaultNodeIcon}
                    />
                    {isEditing ? (
                        <div className="flex items-center gap-1 flex-1">
                            <Input
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        onSaveEdit(item)
                                    } else if (e.key === "Escape") {
                                        onCancelEdit()
                                    }
                                }}
                                className="h-6 text-sm"
                                autoFocus
                            />
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => onSaveEdit(item)}>
                                <Check className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={onCancelEdit}>
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    ) : (
                        <button
                            className="text-sm truncate cursor-pointer flex-1 text-left"
                            onClick={() => {
                                handleSelectChange(item)
                                item.onClick?.()
                            }}
                        >
                            {item.name}
                        </button>
                    )}
                    <TreeMenuBar
                        item={item}
                        isSelected={selectedItemId === item.id}
                        isEditing={isEditing}
                        onStartEdit={onStartEdit}
                        onOpenAddChildDialog={onOpenAddChildDialog}
                        onDeleteItem={onDeleteItem}
                        defaultCanEdit={defaultCanEdit}
                        defaultCanAddChild={defaultCanAddChild}
                        defaultCanDelete={defaultCanDelete}
                        defaultActions={defaultActions}
                        actionRenderer={actionRenderer}
                        showActions={showActions}
                        showActionsOnHover={showActionsOnHover}
                        leafShowActionsOnHover={leafShowActionsOnHover}
                    />
                </AccordionPrimitive.Header>
                <AccordionContent className="ml-4 pl-1 border-l">
                    <TreeItem
                        data={item.children ? item.children : item}
                        selectedItemId={selectedItemId}
                        handleSelectChange={handleSelectChange}
                        expandedItemIds={expandedItemIds}
                        defaultLeafIcon={defaultLeafIcon}
                        defaultNodeIcon={defaultNodeIcon}
                        editingItemId={editingItemId}
                        editingName={editingName}
                        setEditingName={setEditingName}
                        onStartEdit={onStartEdit}
                        onSaveEdit={onSaveEdit}
                        onCancelEdit={onCancelEdit}
                        onOpenAddChildDialog={onOpenAddChildDialog}
                        onDeleteItem={onDeleteItem}
                        defaultCanEdit={defaultCanEdit}
                        defaultCanAddChild={defaultCanAddChild}
                        defaultCanDelete={defaultCanDelete}
                        defaultActions={defaultActions}
                        actionRenderer={actionRenderer}
                        showActions={showActions}
                        showActionsOnHover={showActionsOnHover}
                        leafShowActionsOnHover={leafShowActionsOnHover}
                    />
                </AccordionContent>
            </AccordionPrimitive.Item>
        </AccordionPrimitive.Root>
    )
}

const TreeLeaf = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        item: TreeDataItem
        selectedItemId?: string
        handleSelectChange: (item: TreeDataItem | undefined) => void
        defaultLeafIcon?: any
        defaultNodeIcon?: any
        editingItemId?: string
        editingName: string
        setEditingName: (name: string) => void
        onStartEdit: (item: TreeDataItem) => void
        onSaveEdit: (item: TreeDataItem) => void
        onCancelEdit: () => void
        onOpenAddChildDialog: (item: TreeDataItem) => void
        onDeleteItem: (itemId: string) => void
        defaultCanEdit: boolean
        defaultCanAddChild: boolean
        defaultCanDelete: boolean
        defaultActions?: React.ReactNode
        actionRenderer?: ActionRenderer
        showActions: boolean
        showActionsOnHover: boolean
        leafShowActionsOnHover: boolean
    }
>(
    (
        {
            className,
            item,
            selectedItemId,
            handleSelectChange,
            defaultLeafIcon,
            defaultNodeIcon,
            editingItemId,
            editingName,
            setEditingName,
            onStartEdit,
            onSaveEdit,
            onCancelEdit,
            onOpenAddChildDialog,
            onDeleteItem,
            defaultCanEdit,
            defaultCanAddChild,
            defaultCanDelete,
            defaultActions,
            actionRenderer,
            showActions,
            showActionsOnHover,
            leafShowActionsOnHover,
            ...props
        },
        ref,
    ) => {
        const isEditing = editingItemId === item.id

        return (
            <div
                ref={ref}
                className={cn(
                    "ml-5 flex text-left items-center py-2 cursor-pointer before:right-1",
                    treeVariants(),
                    className,
                    selectedItemId === item.id && selectedTreeVariants(),
                )}
                onClick={() => {
                    if (!isEditing) {
                        handleSelectChange(item)
                        item.onClick?.()
                    }
                }}
                {...props}
            >
                <TreeIcon item={item} isSelected={selectedItemId === item.id} default={defaultLeafIcon} />
                {isEditing ? (
                    <div className="flex items-center gap-1 flex-1">
                        <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    onSaveEdit(item)
                                } else if (e.key === "Escape") {
                                    onCancelEdit()
                                }
                            }}
                            className="h-6 text-sm"
                            autoFocus
                        />
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => onSaveEdit(item)}>
                            <Check className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={onCancelEdit}>
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                ) : (
                    <span className="flex-grow text-sm truncate">{item.name}</span>
                )}
                <TreeMenuBar
                    item={item}
                    isSelected={selectedItemId === item.id}
                    isEditing={isEditing}
                    onStartEdit={onStartEdit}
                    onOpenAddChildDialog={onOpenAddChildDialog}
                    onDeleteItem={onDeleteItem}
                    defaultCanEdit={defaultCanEdit}
                    defaultCanAddChild={defaultCanAddChild}
                    defaultCanDelete={defaultCanDelete}
                    defaultActions={defaultActions}
                    actionRenderer={actionRenderer}
                    showActions={showActions} // 新增
                    showActionsOnHover={showActionsOnHover}
                    leafShowActionsOnHover={leafShowActionsOnHover}
                />
            </div>
        )
    },
)
TreeLeaf.displayName = "TreeLeaf"

const TreeMenuBar = ({
    item,
    isSelected,
    isEditing,
    onStartEdit,
    onOpenAddChildDialog,
    onDeleteItem,
    defaultCanEdit,
    defaultCanAddChild,
    defaultCanDelete,
    defaultActions,
    actionRenderer,
    showActions,
    showActionsOnHover,
    leafShowActionsOnHover,
}: {
    item: TreeDataItem
    isSelected: boolean
    isEditing: boolean
    onStartEdit: (item: TreeDataItem) => void
    onOpenAddChildDialog: (item: TreeDataItem) => void
    onDeleteItem: (itemId: string) => void
    defaultCanEdit: boolean
    defaultCanAddChild: boolean
    defaultCanDelete: boolean
    defaultActions?: React.ReactNode
    actionRenderer?: ActionRenderer
    showActions: boolean
    showActionsOnHover: boolean
    leafShowActionsOnHover: boolean
}) => {
    // 如果全局禁用 actions 或正在編輯，直接返回 null
    if (!showActions || isEditing) {
        return null
    }

    // 檢查是否有任何操作可用
    const canEdit = item.canEdit ?? defaultCanEdit
    const canAddChild = item.canAddChild ?? defaultCanAddChild
    const canDelete = item.canDelete ?? defaultCanDelete

    // 檢查是否有對應的處理函數
    const hasEditHandler = !!(item.onEdit || canEdit)
    const hasAddChildHandler = !!(item.onAddChild || canAddChild)
    const hasDeleteHandler = !!(item.onDelete || canDelete)

    // 獲取 actions
    const customActions = item.actions
    const renderedActions = actionRenderer ? actionRenderer(item) : null
    const defaultActionsToShow = defaultActions

    // 如果沒有任何操作可用且沒有自定義 actions，則不顯示選單
    const hasBuiltInActions = hasEditHandler || hasAddChildHandler || hasDeleteHandler
    const hasCustomActions = !!(customActions || renderedActions || defaultActionsToShow)

    if (!hasBuiltInActions && !hasCustomActions) {
        return null
    }

    const displayClass = isSelected ? "block absolute right-3" : "hidden absolute right-3"

    return (
        <div className={displayClass}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <MoreHorizontal className="h-3 w-3" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    {hasEditHandler && (
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.stopPropagation()
                                onStartEdit(item)
                            }}
                        >
                            <Edit2 className="mr-2 h-4 w-4" />
                            編輯名稱
                        </DropdownMenuItem>
                    )}
                    {hasAddChildHandler && (
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.stopPropagation()
                                onOpenAddChildDialog(item)
                            }}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            新增子項目
                        </DropdownMenuItem>
                    )}
                    {(hasEditHandler || hasAddChildHandler) && hasDeleteHandler && <DropdownMenuSeparator />}
                    {hasDeleteHandler && (
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.stopPropagation()
                                onDeleteItem(item.id)
                            }}
                            className="text-red-600 focus:text-red-600"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            刪除
                        </DropdownMenuItem>
                    )}
                    {hasCustomActions && hasBuiltInActions && <DropdownMenuSeparator />}
                    {customActions}
                    {renderedActions}
                    {defaultActionsToShow}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

const AccordionTrigger = React.forwardRef<
    React.ComponentRef<typeof AccordionPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Header className="flex flex-1 w-full items-center py-2">
        <AccordionPrimitive.Trigger
            ref={ref}
            className={cn("transition-all first:[&[data-state=open]>svg]:rotate-90 flex items-center w-full", className)}
            {...props}
        >
            <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 text-accent-foreground/50 mr-1" />
        </AccordionPrimitive.Trigger>
        {children}
    </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
    React.ComponentRef<typeof AccordionPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content
        ref={ref}
        className={cn(
            "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
            className,
        )}
        {...props}
    >
        <div className="pb-1 pt-0">{children}</div>
    </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

const TreeIcon = ({
    item,
    isOpen,
    isSelected,
    default: defaultIcon,
}: {
    item: TreeDataItem
    isOpen?: boolean
    isSelected?: boolean
    default?: any
}) => {
    let Icon = defaultIcon
    if (isSelected && item.selectedIcon) {
        Icon = item.selectedIcon
    } else if (isOpen && item.openIcon) {
        Icon = item.openIcon
    } else if (item.icon) {
        Icon = item.icon
    }
    return Icon ? Icon : <></>
}

export { TreeView, type TreeDataItem, type ActionRenderer }
