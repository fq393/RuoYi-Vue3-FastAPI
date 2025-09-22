"use client"

import { Separator } from "@/components/ui/separator"
import { ThemeSettings } from "@/components/settings/theme-settings"
import { LayoutSettings } from "@/components/settings/layout-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { AppLayout } from "@/components/app-layout"

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">设置</h3>
        <p className="text-sm text-muted-foreground">
          管理您的应用偏好设置和系统配置
        </p>
      </div>
      <Separator />
      
      <div className="space-y-8">
        <ThemeSettings />
        <Separator />
        <LayoutSettings />
        <Separator />
        <NotificationSettings />
      </div>
    </div>
    </AppLayout>
  )
}