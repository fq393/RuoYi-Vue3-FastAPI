"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Layout, Sidebar, Navigation, Eye, EyeOff } from "lucide-react"

interface LayoutConfig {
  sidebarCollapsed: boolean
  showBreadcrumb: boolean
  showFooter: boolean
  fixedHeader: boolean
  compactMode: boolean
  showPageTitle: boolean
}

export function LayoutSettings() {
  const [config, setConfig] = useState<LayoutConfig>({
    sidebarCollapsed: false,
    showBreadcrumb: true,
    showFooter: true,
    fixedHeader: true,
    compactMode: false,
    showPageTitle: true,
  })

  useEffect(() => {
    // 从localStorage加载配置
    const savedConfig = localStorage.getItem("layout-config")
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig))
      } catch (error) {
        console.error("Failed to parse layout config:", error)
      }
    }
  }, [])

  const updateConfig = (key: keyof LayoutConfig, value: boolean) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = () => {
    localStorage.setItem("layout-config", JSON.stringify(config))
    toast.success("布局设置已保存")
  }

  const handleResetSettings = () => {
    const defaultConfig: LayoutConfig = {
      sidebarCollapsed: false,
      showBreadcrumb: true,
      showFooter: true,
      fixedHeader: true,
      compactMode: false,
      showPageTitle: true,
    }
    setConfig(defaultConfig)
    localStorage.removeItem("layout-config")
    toast.success("布局设置已重置")
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">布局设置</h3>
        <p className="text-sm text-muted-foreground">
          自定义应用的布局和显示选项
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 侧边栏设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sidebar className="h-4 w-4" />
              侧边栏设置
            </CardTitle>
            <CardDescription>配置侧边栏的显示和行为</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sidebar-collapsed">默认折叠侧边栏</Label>
                <p className="text-sm text-muted-foreground">
                  页面加载时侧边栏是否折叠
                </p>
              </div>
              <Switch
                id="sidebar-collapsed"
                checked={config.sidebarCollapsed}
                onCheckedChange={(checked) => updateConfig("sidebarCollapsed", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 导航设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              导航设置
            </CardTitle>
            <CardDescription>配置导航栏的显示选项</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-breadcrumb">显示面包屑导航</Label>
                <p className="text-sm text-muted-foreground">
                  在页面顶部显示当前位置
                </p>
              </div>
              <Switch
                id="show-breadcrumb"
                checked={config.showBreadcrumb}
                onCheckedChange={(checked) => updateConfig("showBreadcrumb", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="fixed-header">固定顶部导航</Label>
                <p className="text-sm text-muted-foreground">
                  滚动时保持导航栏固定
                </p>
              </div>
              <Switch
                id="fixed-header"
                checked={config.fixedHeader}
                onCheckedChange={(checked) => updateConfig("fixedHeader", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 页面设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Layout className="h-4 w-4" />
              页面设置
            </CardTitle>
            <CardDescription>配置页面内容的显示选项</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-page-title">显示页面标题</Label>
                <p className="text-sm text-muted-foreground">
                  在页面内容区域显示标题
                </p>
              </div>
              <Switch
                id="show-page-title"
                checked={config.showPageTitle}
                onCheckedChange={(checked) => updateConfig("showPageTitle", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="compact-mode">紧凑模式</Label>
                <p className="text-sm text-muted-foreground">
                  减少页面元素间距
                </p>
              </div>
              <Switch
                id="compact-mode"
                checked={config.compactMode}
                onCheckedChange={(checked) => updateConfig("compactMode", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 其他设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="h-4 w-4" />
              其他设置
            </CardTitle>
            <CardDescription>其他界面显示选项</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-footer">显示页脚</Label>
                <p className="text-sm text-muted-foreground">
                  在页面底部显示页脚信息
                </p>
              </div>
              <Switch
                id="show-footer"
                checked={config.showFooter}
                onCheckedChange={(checked) => updateConfig("showFooter", checked)}
              />
            </div>
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