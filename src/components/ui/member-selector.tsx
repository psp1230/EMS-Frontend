"use client"

import { useState } from "react"
import { X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export interface Member {
  id: string
  groupId: string | null
  [key: string]: any // 允許額外屬性存在，不報錯
}

export interface Group {
  id: string
  name: string
  members: Member[]
}

interface MemberSelectorProps {
  className?: string
  mode: "member" | "group"
  selectionMode?: "single" | "multiple" // 新增：單選或多選
  members?: Member[]
  groups?: Group[]
  initialSelected?: string[]
  onConfirm?: (selectedIds: string[]) => void
  onCancel?: () => void
}

export default function MemberSelector({
  className = "",
  mode,
  selectionMode = "multiple", // 默認多選
  members = [],
  groups = [],
  initialSelected = [],
  onConfirm,
  onCancel,
}: MemberSelectorProps) {
  const [selectedMembers, setSelectedMembers] = useState<string[]>(
    selectionMode === "single" ? initialSelected.slice(0, 1) : initialSelected,
  )
  const [selectedGroup, setSelectedGroup] = useState<string>(groups.length > 0 ? groups[0].id : "")
  const [searchLeft, setSearchLeft] = useState("")
  const [searchRight, setSearchRight] = useState("")

  const handleRemoveTag = (memberId: string) => {
    setSelectedMembers((prev) => prev.filter((id) => id !== memberId))
  }

  const handleMemberToggle = (memberId: string) => {
    if (selectionMode === "single") {
      // 單選模式：直接設置為當前選中的成員，如果已選中則取消選擇
      setSelectedMembers((prev) => (prev.includes(memberId) ? [] : [memberId]))
    } else {
      // 多選模式：切換選中狀態
      setSelectedMembers((prev) =>
        prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId],
      )
    }
  }

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroup(groupId)
    setSearchRight("") // 清空右側搜尋
  }

  const handleConfirm = () => {
    onConfirm?.(selectedMembers)
  }

  const handleCancel = () => {
    const resetSelected = selectionMode === "single" ? initialSelected.slice(0, 1) : initialSelected
    setSelectedMembers(resetSelected)
    onCancel?.()
  }

  // 根據模式獲取當前顯示的成員
  const getCurrentMembers = () => {
    if (mode === "member") {
      return members
    } else {
      const currentGroup = groups.find((g) => g.id === selectedGroup)
      return currentGroup?.members || []
    }
  }

  // 獲取所有可用的成員（用於顯示標籤）
  const getAllAvailableMembers = () => {
    if (mode === "member") {
      return members
    } else {
      const allMembers: Member[] = []
      groups.forEach((group) => {
        group.members.forEach((member) => {
          if (!allMembers.find((m) => m.id === member.id)) {
            allMembers.push(member)
          }
        })
      })
      return allMembers
    }
  }

  const currentMembers = getCurrentMembers()
  const allAvailableMembers = getAllAvailableMembers()

  const filteredGroups = groups.filter((group) => group.name.toLowerCase().includes(searchLeft.toLowerCase()))

  const filteredMembers = currentMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchRight.toLowerCase()) ||
      (member.displayName && member.displayName.toLowerCase().includes(searchRight.toLowerCase())),
  )

  const selectedMemberObjects = allAvailableMembers.filter((member) => selectedMembers.includes(member.id))

  return (
    <div className={cn("w-full max-w-4xl mx-auto p-6 bg-white rounded-lg", className)}>
      {/* Selected Tags in Textarea-like Container */}
      <div className="mb-6">
        <div className="min-h-36 max-h-32 p-3 border rounded-md bg-gray-50 overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            {selectedMemberObjects.map((member) => (
              <div
                key={member.id}
                className="inline-flex items-center gap-1 px-2 py-1 bg-white border rounded text-sm shadow-sm"
              >
                <span className="max-w-32 truncate">{member.displayName || member.name}</span>
                <button onClick={() => handleRemoveTag(member.id)} className="ml-1 hover:bg-gray-100 rounded p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {selectedMemberObjects.length === 0 && (
              <span className="text-gray-400 text-sm">
                {selectionMode === "single" ? "請選擇一位成員..." : "請選擇成員..."}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Members Label */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-green-600 font-medium">成員</span>
          {selectionMode === "multiple" && selectedMembers.length > 0 && (
            <span className="text-sm text-gray-500">已選擇 {selectedMembers.length} 位成員</span>
          )}
        </div>
      </div>

      {/* Layout based on mode */}
      {mode === "group" ? (
        /* Two Panel Layout for Group Mode */
        <div className="grid grid-cols-2 gap-6">
          {/* Left Panel - Groups */}
          <div className="space-y-4">
            <Input
              placeholder="搜尋群組"
              value={searchLeft}
              onChange={(e) => setSearchLeft(e.target.value)}
              className="w-full"
            />

            <ScrollArea className="h-80 border rounded-md">
              <div className="p-2 space-y-1">
                {filteredGroups.map((group) => (
                  <div
                    key={group.id}
                    className={`px-3 py-2 hover:bg-gray-100 cursor-pointer rounded text-sm ${selectedGroup === group.id ? "bg-gray-200" : ""
                      }`}
                    onClick={() => handleGroupSelect(group.id)}
                  >
                    {group.name}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel - Group Members */}
          <div className="space-y-4">
            <Input
              placeholder="搜尋成員"
              value={searchRight}
              onChange={(e) => setSearchRight(e.target.value)}
              className="w-full"
            />

            <ScrollArea className="h-80 border rounded-md">
              <div className="p-2 space-y-1">
                {selectedGroup && (
                  <div className="px-3 py-1 text-xs text-gray-500 border-b mb-2">
                    {groups.find((g) => g.id === selectedGroup)?.name} ({filteredMembers.length} 位成員)
                  </div>
                )}
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer rounded text-sm ${selectedMembers.includes(member.id) ? "bg-blue-50" : ""
                      }`}
                    onClick={() => handleMemberToggle(member.id)}
                  >
                    {selectedMembers.includes(member.id) && <Check className="w-4 h-4 text-green-600" />}
                    <span className={selectedMembers.includes(member.id) ? "font-medium" : ""}>
                      {member.displayName || member.name}
                    </span>
                    {selectionMode === "single" && selectedMembers.includes(member.id) && (
                      <span className="ml-auto text-xs text-blue-600">已選擇</span>
                    )}
                  </div>
                ))}
                {filteredMembers.length === 0 && (
                  <div className="px-3 py-4 text-gray-400 text-sm text-center">沒有符合條件的成員</div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      ) : (
        /* Single Panel Layout for Member Mode */
        <div className="space-y-4">
          <Input
            placeholder="搜尋成員"
            value={searchRight}
            onChange={(e) => setSearchRight(e.target.value)}
            className="w-full"
          />

          <ScrollArea className="h-80 border rounded-md">
            <div className="p-2 space-y-1">
              <div className="px-3 py-1 text-xs text-gray-500 border-b mb-2">
                成員列表 ({filteredMembers.length} 位成員)
              </div>
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className={`flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer rounded text-sm ${selectedMembers.includes(member.id) ? "bg-blue-50" : ""
                    }`}
                  onClick={() => handleMemberToggle(member.id)}
                >
                  {selectedMembers.includes(member.id) && <Check className="w-4 h-4 text-green-600" />}
                  <span className={selectedMembers.includes(member.id) ? "font-medium" : ""}>
                    {member.displayName || member.name}
                  </span>
                  {selectionMode === "single" && selectedMembers.includes(member.id) && (
                    <span className="ml-auto text-xs text-blue-600">已選擇</span>
                  )}
                </div>
              ))}
              {filteredMembers.length === 0 && (
                <div className="px-3 py-4 text-gray-400 text-sm text-center">沒有符合條件的成員</div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" onClick={handleCancel}>
          取消
        </Button>
        <Button onClick={handleConfirm} disabled={selectionMode === "single" && selectedMembers.length === 0}>
          確認
          {selectionMode === "multiple" && selectedMembers.length > 0 && (
            <span className="ml-1">({selectedMembers.length})</span>
          )}
        </Button>
      </div>
    </div>
  )
}
