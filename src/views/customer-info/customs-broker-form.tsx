"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  name: z.string().min(1, "報關行為必填項目"),
  phone: z.string().min(1, "電話為必填項目"),
  fax: z.string().optional(),
  contactPerson: z.string().min(1, "聯絡人為必填項目"),
})

interface CustomsBrokerFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function CustomsBrokerForm({ initialData, onSubmit, onCancel }: CustomsBrokerFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      phone: initialData?.phone || "",
      fax: initialData?.fax || "",
      contactPerson: initialData?.contactPerson || "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>報關行</FormLabel>
              <FormControl>
                <Input placeholder="請輸入報關行名稱" {...field} />
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
          name="contactPerson"
          render={({ field }) => (
            <FormItem>
              <FormLabel>聯絡人</FormLabel>
              <FormControl>
                <Input placeholder="請輸入聯絡人姓名" {...field} />
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
