"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Upload, Camera } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { api, API_ENDPOINTS } from "@/lib/api"

export function UserAvatar() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      toast.error("请选择图片文件")
      return
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("图片大小不能超过5MB")
      return
    }

    // 创建预览URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleUpload = async () => {
    if (!previewUrl) {
      toast.error("请先选择图片")
      return
    }

    const file = fileInputRef.current?.files?.[0]
    if (!file) {
      toast.error("请先选择图片")
      return
    }

    setLoading(true)
    try {
      // 调用API上传头像
      const response = await api.upload(API_ENDPOINTS.USER.AVATAR, file)
      
      if (response.success) {
        toast.success("头像更新成功")
        setPreviewUrl(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } else {
        toast.error(response.message || "头像上传失败，请重试")
      }
    } catch (error) {
      console.error("头像上传失败:", error)
      toast.error("头像上传失败，请重试")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">修改头像</h3>
        <p className="text-sm text-muted-foreground">
          上传新的头像图片，支持 JPG、PNG 格式，文件大小不超过 5MB
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* 当前头像 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">当前头像</CardTitle>
            <CardDescription>您当前使用的头像</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage src={user?.avatar} alt={user?.username} />
              <AvatarFallback className="text-2xl">
                {user?.username?.charAt(0) || "管"}
              </AvatarFallback>
            </Avatar>
          </CardContent>
        </Card>

        {/* 新头像预览 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">新头像预览</CardTitle>
            <CardDescription>预览上传后的效果</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage src={previewUrl || user?.avatar} alt="预览" />
              <AvatarFallback className="text-2xl">
                {user?.username?.charAt(0) || "管"}
              </AvatarFallback>
            </Avatar>
          </CardContent>
        </Card>
      </div>

      {/* 上传控件 */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="avatar-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Camera className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">点击上传</span> 或拖拽图片到此处
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    支持 PNG, JPG 格式 (最大 5MB)
                  </p>
                </div>
                <input
                  id="avatar-upload"
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={handleReset}
                disabled={!previewUrl}
              >
                重置
              </Button>
              <Button 
                onClick={handleUpload}
                disabled={loading || !previewUrl}
              >
                {loading ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    上传中...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    确认上传
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}