"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { api, API_ENDPOINTS } from "@/lib/api"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "用户名称至少需要2个字符",
  }),
  nickName: z.string().optional(),
  email: z.string().email({
    message: "请输入有效的邮箱地址",
  }),
  phone: z.string().regex(/^1[3-9]\d{9}$/, {
    message: "请输入有效的手机号码",
  }),
  sex: z.string().optional(),
  remark: z.string().optional(),
})

export function UserInfo() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.username || "",
      nickName: user?.nickName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      sex: user?.sex || "0",
      remark: user?.remark || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      // 调用API更新用户信息
      const response = await api.put(API_ENDPOINTS.USER.PROFILE, values)
      
      if (response.success) {
        toast.success("个人信息更新成功")
      } else {
        toast.error(response.message || "更新失败，请重试")
      }
    } catch (error) {
      console.error("更新用户信息失败:", error)
      toast.error("更新失败，请重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">基本资料</h3>
        <p className="text-sm text-muted-foreground">
          更新您的个人信息
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>用户名称</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入用户名称" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="nickName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>用户昵称</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入用户昵称" {...field} />
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
                  <FormLabel>邮箱</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入邮箱" type="email" {...field} />
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
                  <FormLabel>手机号码</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入手机号码" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>性别</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择性别" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">男</SelectItem>
                      <SelectItem value="1">女</SelectItem>
                      <SelectItem value="2">未知</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="remark"
            render={({ field }) => (
              <FormItem>
                <FormLabel>备注</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="请输入备注信息" 
                    className="resize-none" 
                    rows={3}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => form.reset()}
            >
              重置
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "保存中..." : "保存"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}