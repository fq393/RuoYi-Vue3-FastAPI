"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Search, 
  RefreshCw,
  Users,
  Clock,
  Globe,
  Monitor,
  LogOut,
  MapPin,
  Smartphone,
  Laptop,
  Tablet
} from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

interface OnlineUser {
  id: string;
  username: string;
  realName: string;
  avatar?: string;
  ip: string;
  location: string;
  browser: string;
  os: string;
  device: "desktop" | "mobile" | "tablet";
  loginTime: string;
  lastActivity: string;
  sessionId: string;
  status: "active" | "idle" | "away";
}

const mockOnlineUsers: OnlineUser[] = [
  {
    id: "1",
    username: "admin",
    realName: "系统管理员",
    avatar: "/avatars/admin.jpg",
    ip: "192.168.1.100",
    location: "北京市朝阳区",
    browser: "Chrome 120.0",
    os: "Windows 11",
    device: "desktop",
    loginTime: "2024-01-20 09:30:25",
    lastActivity: "2024-01-20 11:45:12",
    sessionId: "sess_admin_001",
    status: "active"
  },
  {
    id: "2",
    username: "editor",
    realName: "内容编辑",
    avatar: "/avatars/editor.jpg",
    ip: "192.168.1.101",
    location: "上海市浦东新区",
    browser: "Safari 17.2",
    os: "macOS 14.2",
    device: "desktop",
    loginTime: "2024-01-20 08:15:18",
    lastActivity: "2024-01-20 11:42:35",
    sessionId: "sess_editor_002",
    status: "active"
  },
  {
    id: "3",
    username: "viewer",
    realName: "数据查看员",
    ip: "192.168.1.102",
    location: "广州市天河区",
    browser: "Chrome Mobile 120.0",
    os: "Android 14",
    device: "mobile",
    loginTime: "2024-01-20 10:20:45",
    lastActivity: "2024-01-20 11:30:22",
    sessionId: "sess_viewer_003",
    status: "idle"
  },
  {
    id: "4",
    username: "operator",
    realName: "系统操作员",
    ip: "192.168.1.103",
    location: "深圳市南山区",
    browser: "Firefox 121.0",
    os: "Ubuntu 22.04",
    device: "desktop",
    loginTime: "2024-01-20 07:45:32",
    lastActivity: "2024-01-20 11:20:15",
    sessionId: "sess_operator_004",
    status: "away"
  },
  {
    id: "5",
    username: "analyst",
    realName: "数据分析师",
    ip: "192.168.1.104",
    location: "杭州市西湖区",
    browser: "Edge 120.0",
    os: "Windows 10",
    device: "tablet",
    loginTime: "2024-01-20 09:10:08",
    lastActivity: "2024-01-20 11:40:55",
    sessionId: "sess_analyst_005",
    status: "active"
  }
];

export default function OnlineUsersPage() {
  const [users, setUsers] = useState<OnlineUser[]>(mockOnlineUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.realName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.ip.includes(searchTerm) ||
    user.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: OnlineUser["status"]) => {
    const variants = {
      active: { variant: "default" as const, label: "活跃", color: "bg-green-500" },
      idle: { variant: "secondary" as const, label: "空闲", color: "bg-yellow-500" },
      away: { variant: "outline" as const, label: "离开", color: "bg-gray-500" }
    };

    const config = variants[status];
    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <div className={`w-2 h-2 rounded-full ${config.color}`} />
        <span>{config.label}</span>
      </Badge>
    );
  };

  const getDeviceIcon = (device: OnlineUser["device"]) => {
    switch (device) {
      case "desktop":
        return <Monitor className="w-4 h-4" />;
      case "mobile":
        return <Smartphone className="w-4 h-4" />;
      case "tablet":
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const handleForceLogout = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleRefresh = () => {
    // 模拟刷新数据
    setUsers([...mockOnlineUsers]);
  };

  const getOnlineDuration = (loginTime: string) => {
    const login = new Date(loginTime);
    const now = currentTime;
    const diff = now.getTime() - login.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`;
    }
    return `${minutes}分钟`;
  };

  const getLastActivityTime = (lastActivity: string) => {
    const activity = new Date(lastActivity);
    const now = currentTime;
    const diff = now.getTime() - activity.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) {
      return "刚刚";
    } else if (minutes < 60) {
      return `${minutes}分钟前`;
    } else {
      const hours = Math.floor(minutes / 60);
      return `${hours}小时前`;
    }
  };

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">在线用户</h2>
            <p className="text-muted-foreground">
              查看当前在线用户和会话信息
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              刷新
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">在线用户</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                当前在线用户总数
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">活跃用户</CardTitle>
              <div className="w-2 h-2 rounded-full bg-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {users.filter(user => user.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground">
                正在活跃操作的用户
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">移动端用户</CardTitle>
              <Smartphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(user => user.device === "mobile").length}
              </div>
              <p className="text-xs text-muted-foreground">
                使用移动设备的用户
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">平均在线时长</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.5小时</div>
              <p className="text-xs text-muted-foreground">
                用户平均在线时长
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>在线用户列表</CardTitle>
            <CardDescription>
              当前系统中所有在线用户的详细信息和会话状态
            </CardDescription>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索用户..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户信息</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>设备信息</TableHead>
                  <TableHead>位置</TableHead>
                  <TableHead>在线时长</TableHead>
                  <TableHead>最后活动</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.realName} />
                          <AvatarFallback>
                            {user.realName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.realName}</div>
                          <div className="text-sm text-muted-foreground">
                            @{user.username}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user.status)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          {getDeviceIcon(user.device)}
                          <span className="text-sm">{user.browser}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user.os}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <Globe className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{user.ip}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {user.location}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {getOnlineDuration(user.loginTime)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {getLastActivityTime(user.lastActivity)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <LogOut className="mr-1 h-3 w-3" />
                            强制下线
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>确认强制下线</AlertDialogTitle>
                            <AlertDialogDescription>
                              您确定要强制用户 &ldquo;{user.realName}&rdquo; 下线吗？
                              此操作将立即终止该用户的会话。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleForceLogout(user.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              确认下线
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}