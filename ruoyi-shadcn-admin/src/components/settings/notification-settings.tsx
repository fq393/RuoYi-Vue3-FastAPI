"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Bell, Mail, MessageSquare, Shield } from "lucide-react"

interface NotificationConfig {
  emailNotifications: boolean
  pushNotifications: boolean
  systemAlerts: boolean
  securityAlerts: boolean
  marketingEmails: boolean
  weeklyReports: boolean
  notificationSound: string
  quietHours: boolean
  quietStart: string
  quietEnd: string
}

export function NotificationSettings() {
  const [config, setConfig] = useState<NotificationConfig>({
    emailNotifications: true,
    pushNotifications: true,
    systemAlerts: true,
    securityAlerts: true,
    marketingEmails: false,
    weeklyReports: true,
    notificationSound: "default",
    quietHours: false,
    quietStart: "22:00",
    quietEnd: "08:00",
  })

  useEffect(() => {
    // 从localStorage加载配置
    const savedConfig = localStorage.getItem("notification-config")
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig))
      } catch (error) {
        console.error("Failed to parse notification config:", error)
      }
    }
  }, [])

  const updateConfig = (key: keyof NotificationConfig, value: boolean | string) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = () => {
    localStorage.setItem("notification-config", JSON.stringify(config))
    toast.success("通知设置已保存")
  }

  const handleResetSettings = () => {
    const defaultConfig: NotificationConfig = {
      emailNotifications: true,
      pushNotifications: true,
      systemAlerts: true,
      securityAlerts: true,
      marketingEmails: false,
      weeklyReports: true,
      notificationSound: "default",
      quietHours: false,
      quietStart: "22:00",
      quietEnd: "08:00",
    }
    setConfig(defaultConfig)
    localStorage.removeItem("notification-config")
    toast.success("通知设置已重置")
  }

  const handleTestNotification = () => {
    toast.success("这是一条测试通知", {
      description: "您的通知设置正常工作",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">通知设置</h3>
        <p className="text-sm text-muted-foreground">
          管理您接收通知的方式和时间
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 通知类型 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4" />
              通知类型
            </CardTitle>
            <CardDescription>选择您希望接收的通知类型</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">邮件通知</Label>
                <p className="text-sm text-muted-foreground">
                  通过邮件接收重要通知
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={config.emailNotifications}
                onCheckedChange={(checked) => updateConfig("emailNotifications", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">推送通知</Label>
                <p className="text-sm text-muted-foreground">
                  在浏览器中显示推送通知
                </p>
              </div>
              <Switch
                id="push-notifications"
                checked={config.pushNotifications}
                onCheckedChange={(checked) => updateConfig("pushNotifications", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="system-alerts">系统提醒</Label>
                <p className="text-sm text-muted-foreground">
                  系统状态和更新提醒
                </p>
              </div>
              <Switch
                id="system-alerts"
                checked={config.systemAlerts}
                onCheckedChange={(checked) => updateConfig("systemAlerts", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 安全和营销 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4" />
              安全和营销
            </CardTitle>
            <CardDescription>安全提醒和营销信息设置</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="security-alerts">安全提醒</Label>
                <p className="text-sm text-muted-foreground">
                  账户安全相关的重要提醒
                </p>
              </div>
              <Switch
                id="security-alerts"
                checked={config.securityAlerts}
                onCheckedChange={(checked) => updateConfig("securityAlerts", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marketing-emails">营销邮件</Label>
                <p className="text-sm text-muted-foreground">
                  产品更新和促销信息
                </p>
              </div>
              <Switch
                id="marketing-emails"
                checked={config.marketingEmails}
                onCheckedChange={(checked) => updateConfig("marketingEmails", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="weekly-reports">周报</Label>
                <p className="text-sm text-muted-foreground">
                  每周活动摘要报告
                </p>
              </div>
              <Switch
                id="weekly-reports"
                checked={config.weeklyReports}
                onCheckedChange={(checked) => updateConfig("weeklyReports", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 通知偏好 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              通知偏好
            </CardTitle>
            <CardDescription>自定义通知的声音和时间</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notification-sound">通知声音</Label>
              <Select 
                value={config.notificationSound} 
                onValueChange={(value) => updateConfig("notificationSound", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择通知声音" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">默认</SelectItem>
                  <SelectItem value="bell">铃声</SelectItem>
                  <SelectItem value="chime">提示音</SelectItem>
                  <SelectItem value="none">静音</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="quiet-hours">免打扰时间</Label>
                <p className="text-sm text-muted-foreground">
                  在指定时间段内不接收通知
                </p>
              </div>
              <Switch
                id="quiet-hours"
                checked={config.quietHours}
                onCheckedChange={(checked) => updateConfig("quietHours", checked)}
              />
            </div>
            
            {config.quietHours && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="quiet-start">开始时间</Label>
                  <Select 
                    value={config.quietStart} 
                    onValueChange={(value) => updateConfig("quietStart", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0')
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiet-end">结束时间</Label>
                  <Select 
                    value={config.quietEnd} 
                    onValueChange={(value) => updateConfig("quietEnd", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0')
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 测试通知 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">测试通知</CardTitle>
            <CardDescription>测试您的通知设置是否正常工作</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleTestNotification} variant="outline" className="w-full">
              发送测试通知
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handleResetSettings}>
          重置设置
        </Button>
        <Button onClick={handleSaveSettings}>
          保存设置
        </Button>
      </div>
    </div>
  )
}