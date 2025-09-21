"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import DatePicker from "@/components/ui/date-picker"

const formSchema = z.object({
  name: z.string().min(1, "廠商為必填項目"),
  phone: z.string().min(1, "電話為必填項目"),
  fax: z.string().optional(),
  unifiedNumber: z.string().min(1, "統一編號為必填項目"),
  email: z.string().email("請輸入有效的電子郵件地址").optional().or(z.literal("")),
  createdDate: z.date({ required_error: "建檔日期為必填項目" }),
})

interface VendorFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function VendorForm({ initialData, onSubmit, onCancel }: VendorFormProps) {
  // @ts-ignore
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      phone: initialData?.phone || "",
      fax: initialData?.fax || "",
      unifiedNumber: initialData?.unifiedNumber || "",
      email: initialData?.email || "",
      createdDate: initialData?.createdDate || new Date(),
    },
  })

  return (
    <Form {...form}>
      {/* @ts-ignore */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>廠商</FormLabel>
              <FormControl>
                <Input placeholder="請輸入廠商名稱" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>電話</FormLabel>
              <FormControl>
                <Input placeholder="請輸入電話號碼" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fax"
          render={({ field }) => (
            <FormItem>
              <FormLabel>傳真</FormLabel>
              <FormControl>
                <Input placeholder="請輸入傳真號碼" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unifiedNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>統一編號</FormLabel>
              <FormControl>
                <Input placeholder="請輸入統一編號" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="請輸入電子郵件地址" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="createdDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>建檔日期</FormLabel>
              <FormControl>
                <DatePicker value={field.value} onChange={field.onChange} placeholder="請選擇建檔日期" locale="zh-TW" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button type="submit">確認</Button>
        </div>
      </form>
    </Form>
  )
}
