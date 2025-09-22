"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { UserInfo } from "@/components/profile/user-info"
import { ResetPassword } from "@/components/profile/reset-password"
import { UserAvatar } from "@/components/profile/user-avatar"
import { useAuth } from "@/contexts/auth-context"
import { AppLayout } from "@/components/app-layout"

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <AppLayout>
      <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">个人中心</h3>
        <p className="text-sm text-muted-foreground">
          管理您的个人信息和账户设置
        </p>
      </div>
      <Separator />
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 用户信息卡片 */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.avatar} alt={user?.username} />
                <AvatarFallback className="text-lg">
                  {user?.username?.charAt(0) || "管"}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">{user?.username || "管理员"}</CardTitle>
            <CardDescription>{user?.email || "admin@ruoyi.com"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">用户名称</span>
                <span className="text-sm">{user?.username || "管理员"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">手机号码</span>
                <span className="text-sm">{user?.phone || "15888888888"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">用户邮箱</span>
                <span className="text-sm">{user?.email || "admin@ruoyi.com"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">所属部门</span>
                <span className="text-sm">{user?.dept?.deptName || "研发部门"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">所属角色</span>
                <div className="flex gap-1">
                  {user?.roles?.map((role: { roleId: string; roleName: string }) => (
                    <Badge key={role.roleId} variant="secondary" className="text-xs">
                      {role.roleName}
                    </Badge>
                  )) || <Badge variant="secondary" className="text-xs">超级管理员</Badge>}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">创建日期</span>
                <span className="text-sm">{user?.createTime || "2024-01-01"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 功能标签页 */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">基本资料</TabsTrigger>
                <TabsTrigger value="avatar">修改头像</TabsTrigger>
                <TabsTrigger value="password">修改密码</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="mt-6">
                <UserInfo />
              </TabsContent>
              
              <TabsContent value="avatar" className="mt-6">
                <UserAvatar />
              </TabsContent>
              
              <TabsContent value="password" className="mt-6">
                <ResetPassword />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
    </AppLayout>
  )
}