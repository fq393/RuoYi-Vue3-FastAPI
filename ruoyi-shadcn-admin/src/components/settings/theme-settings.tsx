"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Sun, Moon, Monitor, Palette } from "lucide-react"

const themeColors = [
  { name: "默认蓝", value: "blue", color: "bg-blue-500" },
  { name: "翠绿", value: "green", color: "bg-green-500" },
  { name: "紫色", value: "purple", color: "bg-purple-500" },
  { name: "橙色", value: "orange", color: "bg-orange-500" },
  { name: "红色", value: "red", color: "bg-red-500" },
  { name: "粉色", value: "pink", color: "bg-pink-500" },
]

export function ThemeSettings() {
  const { theme, setTheme } = useTheme()
  const [selectedColor, setSelectedColor] = useState("blue")

  const handleSaveSettings = () => {
    // 保存主题设置到localStorage
    localStorage.setItem("theme-color", selectedColor)
    toast.success("主题设置已保存")
  }

  const handleResetSettings = () => {
    setTheme("system")
    setSelectedColor("blue")
    localStorage.removeItem("theme-color")
    toast.success("主题设置已重置")
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">主题设置</h3>
        <p className="text-sm text-muted-foreground">
          自定义应用的外观和主题色彩
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 主题模式 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              主题模式
            </CardTitle>
            <CardDescription>选择您偏好的主题模式</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={theme} onValueChange={setTheme}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer">
                  <Sun className="h-4 w-4" />
                  浅色模式
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer">
                  <Moon className="h-4 w-4" />
                  深色模式
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system" className="flex items-center gap-2 cursor-pointer">
                  <Monitor className="h-4 w-4" />
                  跟随系统
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* 主题色彩 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="h-4 w-4" />
              主题色彩
            </CardTitle>
            <CardDescription>选择您喜欢的主题色彩</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {themeColors.map((color) => (
                <div
                  key={color.value}
                  className={`relative cursor-pointer rounded-lg border-2 p-3 transition-colors ${
                    selectedColor === color.value
                      ? "border-primary"
                      : "border-muted hover:border-muted-foreground/50"
                  }`}
                  onClick={() => setSelectedColor(color.value)}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`h-4 w-4 rounded-full ${color.color}`} />
                    <span className="text-sm font-medium">{color.name}</span>
                  </div>
                  {selectedColor === color.value && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary" />
                  )}
                </div>
              ))}
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