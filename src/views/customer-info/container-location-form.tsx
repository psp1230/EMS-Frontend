"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  location: z.string().min(1, "送櫃地點為必填項目"),
  doorDirection: z.string().min(1, "櫃門方向為必填項目"),
  address: z.string().min(1, "裝卸地址為必填項目"),
  phone: z.string().min(1, "電話為必填項目"),
  contactPerson: z.string().min(1, "聯絡人為必填項目"),
})

interface ContainerLocationFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function ContainerLocationForm({ initialData, onSubmit, onCancel }: ContainerLocationFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: initialData?.location || "",
      doorDirection: initialData?.doorDirection || "",
      address: initialData?.address || "",
      phone: initialData?.phone || "",
      contactPerson: initialData?.contactPerson || "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>送櫃地點</FormLabel>
              <FormControl>
                <Input placeholder="請輸入送櫃地點" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="doorDirection"
          render={({ field }) => (
            <FormItem>
              <FormLabel>櫃門方向</FormLabel>
              <FormControl>
                <Input placeholder="請輸入櫃門方向" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>裝卸地址</FormLabel>
              <FormControl>
                <Input placeholder="請輸入裝卸地址" {...field} />
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
