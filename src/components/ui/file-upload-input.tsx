"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Upload, X, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadInputProps {
  onFileSelect?: (file: File | null) => void
  onUploadComplete?: (success: boolean) => void
  accept?: string
  maxSize?: number // in MB
  className?: string
}

export function FileUploadInput({
  onFileSelect,
  onUploadComplete,
  accept = "*/*",
  maxSize = 10,
  className,
}: FileUploadInputProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null

    if (file) {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`檔案大小不能超過 ${maxSize}MB`)
        return
      }

      setSelectedFile(file)
      setUploadStatus("idle")
      onFileSelect?.(file)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setUploadStatus("idle")
    onFileSelect?.(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadStatus("idle")

    try {
      // 模擬上傳過程
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // 這裡可以替換為實際的上傳邏輯
      // const formData = new FormData()
      // formData.append('file', selectedFile)
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData
      // })

      setUploadStatus("success")
      onUploadComplete?.(true)
    } catch (error) {
      setUploadStatus("error")
      onUploadComplete?.(false)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* 隱藏的文件輸入 */}
      <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileSelect} className="hidden" />

      {/* 選擇檔案按鈕 */}
      <Button variant="link" className="text-blue-600 p-0 h-auto" onClick={handleButtonClick} disabled={isUploading}>
        <FileText className="w-4 h-4 mr-1" />
        選擇檔案
      </Button>

      {/* 已選擇的檔案資訊 */}
      {selectedFile && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {uploadStatus === "success" && <Check className="w-4 h-4 text-green-500" />}
            {uploadStatus === "error" && <X className="w-4 h-4 text-red-500" />}
            <Button variant="ghost" size="sm" onClick={handleRemoveFile} disabled={isUploading}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* 上傳狀態訊息 */}
      {uploadStatus === "success" && <p className="text-sm text-green-600">檔案上傳成功！</p>}
      {uploadStatus === "error" && <p className="text-sm text-red-600">檔案上傳失敗，請重試。</p>}
    </div>
  )
}