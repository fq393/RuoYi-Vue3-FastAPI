"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  Home,
  Monitor,
  FileText,
  Wrench
} from "lucide-react";

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const menuItems = [
    {
      title: "系统管理",
      description: "用户、角色、菜单管理",
      icon: Users,
      items: [
        { name: "用户管理", path: "/system/users" },
        { name: "角色管理", path: "/system/roles" },
        { name: "菜单管理", path: "/system/menus" }
      ]
    },
    {
      title: "系统监控",
      description: "服务器、在线用户、日志监控",
      icon: Monitor,
      items: [
        { name: "服务监控", path: "/monitor/server" },
        { name: "在线用户", path: "/monitor/online" },
        { name: "系统日志", path: "/monitor/logs" }
      ]
    },
    {
      title: "系统工具",
      description: "代码生成、系统接口",
      icon: Wrench,
      items: [
        { name: "代码生成", path: "/tools/generator" },
        { name: "系统接口", path: "/tools/system" }
      ]
    }
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppLayout>
      {/* 主要内容区域 */}
      <div className="p-6">
        {/* 欢迎卡片 */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 text-white dark:text-slate-900">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Home className="w-8 h-8" />
              <div>
                <CardTitle className="text-2xl">欢迎回来！</CardTitle>
                <CardDescription className="text-slate-200 dark:text-slate-700">
                  {user?.username || "管理员"}，今天是 {new Date().toLocaleDateString('zh-CN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    weekday: 'long'
                  })}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* 功能模块网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((module, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200 border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-xl flex items-center justify-center">
                    <module.icon className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {module.items.map((item, itemIndex) => (
                    <Button
                      key={itemIndex}
                      variant="ghost"
                      className="w-full justify-start h-auto p-3 text-left"
                      onClick={() => router.push(item.path)}
                    >
                      <span className="text-sm">{item.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 快速统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card className="border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">在线用户</p>
                  <p className="text-2xl font-bold">128</p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">系统状态</p>
                  <p className="text-2xl font-bold">正常</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">今日访问</p>
                  <p className="text-2xl font-bold">1,234</p>
                </div>
                <FileText className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">系统版本</p>
                  <p className="text-2xl font-bold">v3.8.8</p>
                </div>
                <Settings className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
