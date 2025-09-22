"use client";

import { AppLayout } from "@/components/app-layout";
import IFrame from "@/components/iframe";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Globe,
  Code,
  FileText,
  ExternalLink,
  BookOpen,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SystemApiPage() {
  // 获取API文档URL - 修复为正确的后端地址和端口
  const apiDocUrl = process.env.NEXT_PUBLIC_API_BASE_URL 
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/docs`
    : "http://localhost:9099/docs";

  const openApiJson = process.env.NEXT_PUBLIC_API_BASE_URL 
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/openapi.json`
    : "http://localhost:9099/openapi.json";

  const redocUrl = process.env.NEXT_PUBLIC_API_BASE_URL 
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/redoc`
    : "http://localhost:9099/redoc";

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">系统接口</h1>
            <p className="text-muted-foreground">
              查看和测试系统API接口文档
            </p>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            API文档
          </Badge>
        </div>

        {/* API文档信息卡片 */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Swagger UI</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">交互式文档</div>
              <p className="text-xs text-muted-foreground">
                可直接测试API接口
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => window.open(apiDocUrl, '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                新窗口打开
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ReDoc</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">美化文档</div>
              <p className="text-xs text-muted-foreground">
                更美观的API文档展示
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => window.open(redocUrl, '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                新窗口打开
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">OpenAPI JSON</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">原始数据</div>
              <p className="text-xs text-muted-foreground">
                OpenAPI规范JSON文件
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => window.open(openApiJson, '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                查看JSON
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Swagger UI 嵌入 */}
        <IFrame
          src={apiDocUrl}
          title="Swagger API 文档"
          height="800px"
          className="w-full"
        />

        {/* 使用说明 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              使用说明
            </CardTitle>
            <CardDescription>
              如何使用API文档进行接口测试
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">📖 查看接口</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 点击接口名称查看详细信息</li>
                  <li>• 查看请求参数和响应格式</li>
                  <li>• 了解接口的功能说明</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🧪 测试接口</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                   <li>• 点击&ldquo;Try it out&rdquo;按钮</li>
                   <li>• 填写必要的请求参数</li>
                   <li>• 点击&ldquo;Execute&rdquo;执行请求</li>
                   <li>• 查看返回结果和状态码</li>
                 </ul>
              </div>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                💡 提示：某些接口需要先进行身份认证，请确保已登录系统或提供有效的访问令牌。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}