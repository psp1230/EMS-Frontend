"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { Contact } from "@/types/company"

const formSchema = z.object({
  name: z.string().min(1, "接洽人為必填"),
  phone: z.string().min(1, "電話為必填"),
})

interface ContactFormProps {
  initialData?: Partial<Contact>
  onSubmit: (data: z.infer<typeof formSchema>) => void
  onCancel: () => void
}

export function ContactForm({ initialData, onSubmit, onCancel }: ContactFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      phone: initialData?.phone || "",
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
              <FormLabel>接洽人</FormLabel>
              <FormControl>
                <Input placeholder="請輸入接洽人姓名" {...field} />
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

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button type="submit">{initialData ? "更新" : "新增"}</Button>
        </div>
      </form>
    </Form>
  )
}
