"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  code: z.string().min(1, "編號為必填"),
  name: z.string().min(1, "名稱為必填"),
  shortName: z.string().min(1, "簡稱為必填"),
  unifiedNumber: z.string().min(1, "統一編號為必填"),
  responsible: z.string().min(1, "負責人為必填"),
  contact: z.string().min(1, "聯絡人為必填"),
  endDate: z.string().min(1, "結帳日為必填"),
  address: z.string().min(1, "地址為必填"),
  taxType: z.string().min(1, "稅別為必填"),
  phone: z.string().min(1, "電話為必填"),
  companyPhone: z.string().optional(),
  fax: z.string().optional(),
  remarks: z.string().optional(),
})

interface CompanyFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function CompanyForm({ initialData, onSubmit, onCancel }: CompanyFormProps) {
  // @ts-ignore
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: initialData?.code || "",
      name: initialData?.name || "",
      shortName: initialData?.shortName || "",
      unifiedNumber: initialData?.unifiedNumber || "",
      responsible: initialData?.responsible || "",
      contact: initialData?.contact || "",
      endDate: initialData?.endDate || "",
      address: initialData?.address || "",
      taxType: initialData?.taxType || "外加",
      phone: initialData?.phone || "",
      companyPhone: initialData?.companyPhone || "",
      fax: initialData?.fax || "",
      remarks: initialData?.remarks || "",
    },
  })

  return (
    <Form {...form}>
      {/* @ts-ignore */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex justify-end space-x-2">
          <Button type="submit">{initialData ? "更新" : "新增"}</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>編號</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>名稱</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shortName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>簡稱</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="responsible"
            render={({ field }) => (
              <FormItem>
                <FormLabel>負責人</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>聯絡人</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>結帳日</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="taxType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>稅別</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇稅別" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="外加">外加</SelectItem>
                    <SelectItem value="內含">內含</SelectItem>
                    <SelectItem value="不開">不開</SelectItem>
                  </SelectContent>
                </Select>
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>公司電話</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>地址</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>備註</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
