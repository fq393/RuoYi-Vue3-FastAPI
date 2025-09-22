"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { api, API_ENDPOINTS } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Calendar,
  User,
  Globe,
  MoreHorizontal,
  Eye,
  Trash2,
  Clock,
  Monitor,
  Activity
} from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { toast } from "sonner";

interface OperationLog {
  id: string;
  username: string;
  operation: string;
  method: string;
  url: string;
  ip: string;
  location: string;
  status: "success" | "error" | "warning" | "info";
  statusCode: number;
  duration: number;
  userAgent: string;
  createdAt: string;
  description?: string;
}

const mockLogs: OperationLog[] = [
  {
    id: "1",
    username: "admin",
    operation: "用户登录",
    method: "POST",
    url: "/api/auth/login",
    ip: "192.168.1.100",
    location: "北京市",
    status: "success",
    statusCode: 200,
    duration: 156,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    createdAt: "2024-01-20 10:30:25",
    description: "管理员登录系统"
  },
  {
    id: "2",
    username: "editor",
    operation: "创建用户",
    method: "POST",
    url: "/api/users",
    ip: "192.168.1.101",
    location: "上海市",
    status: "success",
    statusCode: 201,
    duration: 234,
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    createdAt: "2024-01-20 10:25:18",
    description: "创建新用户账户"
  },
  {
    id: "3",
    username: "admin",
    operation: "删除角色",
    method: "DELETE",
    url: "/api/roles/5",
    ip: "192.168.1.100",
    location: "北京市",
    status: "error",
    statusCode: 403,
    duration: 89,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    createdAt: "2024-01-20 10:20:45",
    description: "尝试删除系统角色失败"
  },
  {
    id: "4",
    username: "viewer",
    operation: "查看用户列表",
    method: "GET",
    url: "/api/users",
    ip: "192.168.1.102",
    location: "广州市",
    status: "success",
    statusCode: 200,
    duration: 45,
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15",
    createdAt: "2024-01-20 10:15:32",
    description: "查看系统用户列表"
  },
  {
    id: "5",
    username: "editor",
    operation: "更新菜单",
    method: "PUT",
    url: "/api/menus/12",
    ip: "192.168.1.101",
    location: "上海市",
    status: "warning",
    statusCode: 200,
    duration: 312,
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    createdAt: "2024-01-20 10:10:15",
    description: "更新菜单配置，存在权限警告"
  },
  {
    id: "6",
    username: "admin",
    operation: "系统备份",
    method: "POST",
    url: "/api/system/backup",
    ip: "192.168.1.100",
    location: "北京市",
    status: "info",
    statusCode: 202,
    duration: 1250,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    createdAt: "2024-01-20 10:05:08",
    description: "执行系统数据备份任务"
  }
];

export default function OperationLogsPage() {
  const [logs, setLogs] = useState<OperationLog[]>(mockLogs);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  const [viewingLog, setViewingLog] = useState<OperationLog | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState<string>("today");

  // 获取操作日志数据
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get(API_ENDPOINTS.MONITOR.LOGS);
      if (response.success && response.data) {
        setLogs(response.data);
      }
    } catch (error) {
      console.error("获取操作日志失败:", error);
      // 如果API调用失败，继续使用模拟数据
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.operation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    const matchesMethod = methodFilter === "all" || log.method === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getStatusIcon = (status: OperationLog["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: OperationLog["status"]) => {
    const variants = {
      success: "default",
      error: "destructive",
      warning: "secondary",
      info: "outline"
    } as const;
    
    const labels = {
      success: "成功",
      error: "失败",
      warning: "警告",
      info: "信息"
    };

    return (
      <Badge variant={variants[status]} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {labels[status]}
      </Badge>
    );
  };

  // 处理全选/取消全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLogs(filteredLogs.map(log => log.id));
    } else {
      setSelectedLogs([]);
    }
  };

  // 处理单个选择
  const handleSelectLog = (logId: string, checked: boolean) => {
    if (checked) {
      setSelectedLogs(prev => [...prev, logId]);
    } else {
      setSelectedLogs(prev => prev.filter(id => id !== logId));
    }
  };

  // 查看日志详情
  const handleViewLog = (log: OperationLog) => {
    setViewingLog(log);
    setIsViewDialogOpen(true);
  };

  // 批量删除日志
  const handleBatchDelete = async () => {
    if (selectedLogs.length === 0) {
      toast.error("请选择要删除的日志");
      return;
    }

    try {
      // 这里应该调用API删除选中的日志
      // await api.delete(API_ENDPOINTS.MONITOR.LOGS, { ids: selectedLogs });
      
      // 模拟删除操作
      setLogs(prev => prev.filter(log => !selectedLogs.includes(log.id)));
      setSelectedLogs([]);
      toast.success(`成功删除 ${selectedLogs.length} 条日志`);
    } catch (error) {
      toast.error("删除日志失败");
    }
  };

  // 删除单个日志
  const handleDeleteLog = async (logId: string) => {
    try {
      // 这里应该调用API删除指定日志
      // await api.delete(`${API_ENDPOINTS.MONITOR.LOGS}/${logId}`);
      
      // 模拟删除操作
      setLogs(prev => prev.filter(log => log.id !== logId));
      setSelectedLogs(prev => prev.filter(id => id !== logId));
      toast.success("删除日志成功");
    } catch (error) {
      toast.error("删除日志失败");
    }
  };

  // 导出日志
  const handleExportLogs = () => {
    const dataToExport = selectedLogs.length > 0 
      ? logs.filter(log => selectedLogs.includes(log.id))
      : filteredLogs;

    const csvContent = [
      ["用户名", "操作", "请求方法", "请求URL", "IP地址", "位置", "状态", "状态码", "耗时(ms)", "操作时间", "描述"],
      ...dataToExport.map(log => [
        log.username,
        log.operation,
        log.method,
        log.url,
        log.ip,
        log.location,
        log.status,
        log.statusCode.toString(),
        log.duration.toString(),
        log.createdAt,
        log.description || ""
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `operation_logs_${new Date().getTime()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`成功导出 ${dataToExport.length} 条日志`);
  };

  // 清空日志
  const handleClearLogs = async () => {
    try {
      // 这里应该调用API清空日志
      // await api.delete(API_ENDPOINTS.MONITOR.LOGS_CLEAR);
      
      // 模拟清空操作
      setLogs([]);
      setSelectedLogs([]);
      toast.success("日志已清空");
    } catch (error) {
      toast.error("清空日志失败");
    }
  };

  // 获取方法标签颜色
  const getMethodBadgeVariant = (method: string) => {
    switch (method) {
      case "GET":
        return "outline";
      case "POST":
        return "default";
      case "PUT":
        return "secondary";
      case "DELETE":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getMethodBadge = (method: string) => {
    const colors = {
      GET: "bg-green-100 text-green-800",
      POST: "bg-blue-100 text-blue-800",
      PUT: "bg-yellow-100 text-yellow-800",
      DELETE: "bg-red-100 text-red-800",
      PATCH: "bg-purple-100 text-purple-800"
    } as const;

    return (
      <Badge variant="outline" className={colors[method as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {method}
      </Badge>
    );
  };

  const handleRefresh = () => {
    fetchLogs();
  };

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Monitor className="w-8 h-8" />
              操作日志
            </h2>
            <p className="text-muted-foreground">
              查看和管理系统操作日志记录，监控用户行为和系统状态
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleRefresh} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              刷新
            </Button>
            <Button onClick={handleExportLogs} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              导出
            </Button>
            {selectedLogs.length > 0 && (
              <Button onClick={handleBatchDelete} variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                删除选中 ({selectedLogs.length})
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>批量操作</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleExportLogs}>
                  <Download className="w-4 h-4 mr-2" />
                  导出日志
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleClearLogs} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  清空所有日志
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总日志数</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{logs.length}</div>
              <p className="text-xs text-muted-foreground">
                系统操作记录总数
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">成功操作</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {logs.filter(log => log.status === "success").length}
              </div>
              <p className="text-xs text-muted-foreground">
                执行成功的操作数量
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">失败操作</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {logs.filter(log => log.status === "error").length}
              </div>
              <p className="text-xs text-muted-foreground">
                执行失败的操作数量
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">活跃用户</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(logs.map(log => log.username)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                有操作记录的用户数
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              操作日志列表
            </CardTitle>
            <CardDescription>
              查看系统中所有用户的操作记录和详细信息，支持多维度筛选和搜索
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索用户名、操作、URL或IP地址..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  高级筛选
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="状态筛选" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="success">✅ 成功</SelectItem>
                    <SelectItem value="error">❌ 失败</SelectItem>
                    <SelectItem value="warning">⚠️ 警告</SelectItem>
                    <SelectItem value="info">ℹ️ 信息</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={methodFilter} onValueChange={setMethodFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="请求方法" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部方法</SelectItem>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="时间范围" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">今天</SelectItem>
                    <SelectItem value="yesterday">昨天</SelectItem>
                    <SelectItem value="week">最近一周</SelectItem>
                    <SelectItem value="month">最近一月</SelectItem>
                    <SelectItem value="all">全部时间</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>共 {filteredLogs.length} 条记录</span>
                </div>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedLogs.length === filteredLogs.length && filteredLogs.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>用户</TableHead>
                  <TableHead>操作</TableHead>
                  <TableHead>请求</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>IP地址</TableHead>
                  <TableHead>耗时</TableHead>
                  <TableHead>时间</TableHead>
                  <TableHead className="w-20">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className={selectedLogs.includes(log.id) ? "bg-muted/50" : ""}>
                    <TableCell>
                      <Checkbox
                        checked={selectedLogs.includes(log.id)}
                        onCheckedChange={(checked) => handleSelectLog(log.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{log.username}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.operation}</div>
                        {log.description && (
                          <div className="text-sm text-muted-foreground">
                            {log.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          {getMethodBadge(log.method)}
                          <code className="text-xs bg-muted px-1 py-0.5 rounded">
                            {log.url}
                          </code>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          状态码: {log.statusCode}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(log.status)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <Globe className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{log.ip}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {log.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {log.duration}ms
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{log.createdAt}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">打开菜单</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>操作</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewLog(log)}>
                            <Eye className="mr-2 h-4 w-4" />
                            查看详情
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteLog(log.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 日志详情对话框 */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>操作日志详情</span>
              </DialogTitle>
              <DialogDescription>
                查看操作日志的详细信息
              </DialogDescription>
            </DialogHeader>
            {viewingLog && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">用户名</label>
                    <p className="text-sm">{viewingLog.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">操作</label>
                    <p className="text-sm">{viewingLog.operation}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">请求方法</label>
                    <div className="flex items-center space-x-2">
                      {getMethodBadge(viewingLog.method)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">状态</label>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(viewingLog.status)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">状态码</label>
                    <p className="text-sm">{viewingLog.statusCode}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">耗时</label>
                    <p className="text-sm">{viewingLog.duration}ms</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">IP地址</label>
                    <p className="text-sm">{viewingLog.ip}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">地理位置</label>
                    <p className="text-sm">{viewingLog.location}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">请求URL</label>
                    <code className="block text-xs bg-muted p-2 rounded mt-1">
                      {viewingLog.url}
                    </code>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">User Agent</label>
                    <p className="text-xs text-muted-foreground break-all">
                      {viewingLog.userAgent}
                    </p>
                  </div>
                  {viewingLog.description && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">描述</label>
                      <p className="text-sm">{viewingLog.description}</p>
                    </div>
                  )}
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">操作时间</label>
                    <p className="text-sm">{viewingLog.createdAt}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}