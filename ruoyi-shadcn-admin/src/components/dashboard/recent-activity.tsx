"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

interface Activity {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target: string;
  type: "create" | "update" | "delete" | "login";
  timestamp: Date;
}

const activities: Activity[] = [
  {
    id: "1",
    user: { name: "张三", avatar: "/avatars/01.png" },
    action: "创建了新用户",
    target: "李四",
    type: "create",
    timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5分钟前
  },
  {
    id: "2",
    user: { name: "王五", avatar: "/avatars/02.png" },
    action: "更新了角色权限",
    target: "管理员角色",
    type: "update",
    timestamp: new Date(Date.now() - 1000 * 60 * 15) // 15分钟前
  },
  {
    id: "3",
    user: { name: "赵六", avatar: "/avatars/03.png" },
    action: "删除了菜单项",
    target: "测试菜单",
    type: "delete",
    timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30分钟前
  },
  {
    id: "4",
    user: { name: "钱七", avatar: "/avatars/04.png" },
    action: "登录系统",
    target: "",
    type: "login",
    timestamp: new Date(Date.now() - 1000 * 60 * 45) // 45分钟前
  },
  {
    id: "5",
    user: { name: "孙八", avatar: "/avatars/05.png" },
    action: "创建了新角色",
    target: "编辑者",
    type: "create",
    timestamp: new Date(Date.now() - 1000 * 60 * 60) // 1小时前
  }
];

function getActivityBadgeVariant(type: Activity["type"]) {
  switch (type) {
    case "create":
      return "default";
    case "update":
      return "secondary";
    case "delete":
      return "destructive";
    case "login":
      return "outline";
    default:
      return "default";
  }
}

function getActivityIcon(type: Activity["type"]) {
  switch (type) {
    case "create":
      return "➕";
    case "update":
      return "✏️";
    case "delete":
      return "🗑️";
    case "login":
      return "🔑";
    default:
      return "📝";
  }
}

export function RecentActivity() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>最近活动</CardTitle>
        <CardDescription>
          系统最新的操作记录
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium leading-none">
                    {activity.user.name}
                  </p>
                  <Badge variant={getActivityBadgeVariant(activity.type)} className="text-xs">
                    {getActivityIcon(activity.type)} {activity.action}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  {activity.target && (
                    <p className="text-sm text-muted-foreground">
                      目标: {activity.target}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(activity.timestamp, { 
                      addSuffix: true, 
                      locale: zhCN 
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}