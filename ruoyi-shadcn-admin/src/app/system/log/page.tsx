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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  Trash2, 
  FileText,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Calendar,
  User,
  Globe,
  Clock,
  Settings,
  Activity,
  Shield,
  LogIn,
  Monitor
} from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { toast } from "sonner";

interface OperationLog {
  id: string;
  title: string;
  businessType: string;
  method: string;
  requestMethod: string;
  operatorType: string;
  operName: string;
  deptName: string;
  operUrl: string;
  operIp: string;
  operLocation: string;
  operParam: string;
  jsonResult: string;
  status: "success" | "error";
  errorMsg?: string;
  operTime: string;
}

interface LoginLog {
  id: string;
  userName: string;
  ipaddr: string;
  loginLocation: string;
  browser: string;
  os: string;
  status: "success" | "error";
  msg: string;
  loginTime: string;
}

const mockOperationLogs: OperationLog[] = [
  {
    id: "1",
    title: "用户管理",
    businessType: "新增",
    method: "com.ruoyi.web.controller.system.SysUserController.add()",
    requestMethod: "POST",
    operatorType: "管理员",
    operName: "admin",
    deptName: "研发部门",
    operUrl: "/system/user",
    operIp: "127.0.0.1",
    operLocation: "内网IP",
    operParam: "",
    jsonResult: "",
    status: "success",
    operTime: "2024-01-20 10:30:00"
  },
  {
    id: "2",
    title: "角色管理",
    businessType: "修改",
    method: "com.ruoyi.web.controller.system.SysRoleController.edit()",
    requestMethod: "PUT",
    operatorType: "管理员",
    operName: "admin",
    deptName: "研发部门",
    operUrl: "/system/role",
    operIp: "127.0.0.1",
    operLocation: "内网IP",
    operParam: "",
    jsonResult: "",
    status: "success",
    operTime: "2024-01-20 09:15:00"
  }
];

const mockLoginLogs: LoginLog[] = [
  {
    id: "1",
    userName: "admin",
    ipaddr: "127.0.0.1",
    loginLocation: "内网IP",
    browser: "Chrome 12",
    os: "Windows 10",
    status: "success",
    msg: "登录成功",
    loginTime: "2024-01-20 10:30:00"
  },
  {
    id: "2",
    userName: "test",
    ipaddr: "192.168.1.100",
    loginLocation: "内网IP",
    browser: "Firefox 11",
    os: "Windows 10",
    status: "error",
    msg: "密码错误",
    loginTime: "2024-01-20 09:15:00"
  }
];

export default function LogPage() {
  // 基础状态
  const [searchTerm, setSearchTerm] = useState("");
  const [operationLogs, setOperationLogs] = useState<OperationLog[]>(mockOperationLogs);
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>(mockLoginLogs);
  const [loading, setLoading] = useState(false);
  
  // 筛选状态
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [businessTypeFilter, setBusinessTypeFilter] = useState<string>("all");
  const [operationStatusFilter, setOperationStatusFilter] = useState<string>("all");
  const [operationTypeFilter, setOperationTypeFilter] = useState<string>("all");
  const [loginStatusFilter, setLoginStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: ""
  });
  
  // 选择状态
  const [selectedOperationLogs, setSelectedOperationLogs] = useState<string[]>([]);
  const [selectedLoginLogs, setSelectedLoginLogs] = useState<string[]>([]);
  
  // 对话框状态
  const [viewingOperationLog, setViewingOperationLog] = useState<OperationLog | null>(null);
  const [viewingLoginLog, setViewingLoginLog] = useState<LoginLog | null>(null);
  const [isOperationDialogOpen, setIsOperationDialogOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  // 获取数据
  const fetchLogs = async () => {
    setLoading(true);
    try {
      // 这里应该调用API获取日志数据
      // const [operationResponse, loginResponse] = await Promise.all([
      //   api.get(API_ENDPOINTS.SYSTEM.OPERATION_LOGS),
      //   api.get(API_ENDPOINTS.SYSTEM.LOGIN_LOGS)
      // ]);
      // setOperationLogs(operationResponse.data);
      // setLoginLogs(loginResponse.data);
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      toast.error("获取日志数据失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // 过滤逻辑
  const filteredOperationLogs = operationLogs.filter(log => {
    const matchesSearch = log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.operName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = operationStatusFilter === 'all' || !operationStatusFilter || log.status === operationStatusFilter;
    const matchesType = operationTypeFilter === 'all' || !operationTypeFilter || log.businessType === operationTypeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const filteredLoginLogs = loginLogs.filter(log => {
    const matchesSearch = log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.ipaddr.includes(searchTerm);
    const matchesStatus = loginStatusFilter === 'all' || !loginStatusFilter || log.status === loginStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // 状态图标
  const getStatusIcon = (status: "success" | "error") => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  // 状态徽章
  const getStatusBadge = (status: "success" | "error") => {
    const variants = {
      success: "default",
      error: "destructive"
    } as const;

    const labels = {
      success: "成功",
      error: "失败"
    };

    return (
      <Badge variant={variants[status]} className="flex items-center space-x-1">
        {getStatusIcon(status)}
        <span>{labels[status]}</span>
      </Badge>
    );
  };

  // 操作日志选择
  const handleSelectOperationLog = (logId: string, checked: boolean) => {
    if (checked) {
      setSelectedOperationLogs(prev => [...prev, logId]);
    } else {
      setSelectedOperationLogs(prev => prev.filter(id => id !== logId));
    }
  };

  const handleSelectAllOperationLogs = (checked: boolean) => {
    if (checked) {
      setSelectedOperationLogs(filteredOperationLogs.map(log => log.id));
    } else {
      setSelectedOperationLogs([]);
    }
  };

  // 登录日志选择
  const handleSelectLoginLog = (logId: string, checked: boolean) => {
    if (checked) {
      setSelectedLoginLogs(prev => [...prev, logId]);
    } else {
      setSelectedLoginLogs(prev => prev.filter(id => id !== logId));
    }
  };

  const handleSelectAllLoginLogs = (checked: boolean) => {
    if (checked) {
      setSelectedLoginLogs(filteredLoginLogs.map(log => log.id));
    } else {
      setSelectedLoginLogs([]);
    }
  };

  // 查看详情
  const handleViewOperationLog = (log: OperationLog) => {
    setViewingOperationLog(log);
    setIsOperationDialogOpen(true);
  };

  const handleViewLoginLog = (log: LoginLog) => {
    setViewingLoginLog(log);
    setIsLoginDialogOpen(true);
  };

  // 删除操作
  const handleDeleteOperationLog = async (logId: string) => {
    try {
      setOperationLogs(prev => prev.filter(log => log.id !== logId));
      setSelectedOperationLogs(prev => prev.filter(id => id !== logId));
      toast.success("删除操作日志成功");
    } catch (error) {
      toast.error("删除操作日志失败");
    }
  };

  const handleDeleteLoginLog = async (logId: string) => {
    try {
      setLoginLogs(prev => prev.filter(log => log.id !== logId));
      setSelectedLoginLogs(prev => prev.filter(id => id !== logId));
      toast.success("删除登录日志成功");
    } catch (error) {
      toast.error("删除登录日志失败");
    }
  };

  // 批量删除
  const handleBatchDeleteOperationLogs = async () => {
    if (selectedOperationLogs.length === 0) {
      toast.error("请选择要删除的操作日志");
      return;
    }

    try {
      setOperationLogs(prev => prev.filter(log => !selectedOperationLogs.includes(log.id)));
      setSelectedOperationLogs([]);
      toast.success(`成功删除 ${selectedOperationLogs.length} 条操作日志`);
    } catch (error) {
      toast.error("批量删除操作日志失败");
    }
  };

  const handleBatchDeleteLoginLogs = async () => {
    if (selectedLoginLogs.length === 0) {
      toast.error("请选择要删除的登录日志");
      return;
    }

    try {
      setLoginLogs(prev => prev.filter(log => !selectedLoginLogs.includes(log.id)));
      setSelectedLoginLogs([]);
      toast.success(`成功删除 ${selectedLoginLogs.length} 条登录日志`);
    } catch (error) {
      toast.error("批量删除登录日志失败");
    }
  };

  // 导出功能
  const handleExportOperationLogs = () => {
    const dataToExport = selectedOperationLogs.length > 0 
      ? operationLogs.filter(log => selectedOperationLogs.includes(log.id))
      : filteredOperationLogs;

    const csvContent = [
      ["标题", "业务类型", "操作人员", "部门", "请求方法", "操作地址", "操作IP", "操作地点", "状态", "操作时间"],
      ...dataToExport.map(log => [
        log.title,
        log.businessType,
        log.operName,
        log.deptName,
        log.requestMethod,
        log.operUrl,
        log.operIp,
        log.operLocation,
        log.status === "success" ? "成功" : "失败",
        log.operTime
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `操作日志_${format(new Date(), "yyyy-MM-dd_HH-mm-ss", { locale: zhCN })}.csv`;
    link.click();
    toast.success("操作日志导出成功");
  };

  const handleExportLoginLogs = () => {
    const dataToExport = selectedLoginLogs.length > 0 
      ? loginLogs.filter(log => selectedLoginLogs.includes(log.id))
      : filteredLoginLogs;

    const csvContent = [
      ["用户名", "登录IP", "登录地点", "浏览器", "操作系统", "状态", "描述", "登录时间"],
      ...dataToExport.map(log => [
        log.userName,
        log.ipaddr,
        log.loginLocation,
        log.browser,
        log.os,
        log.status === "success" ? "成功" : "失败",
        log.msg,
        log.loginTime
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `登录日志_${format(new Date(), "yyyy-MM-dd_HH-mm-ss", { locale: zhCN })}.csv`;
    link.click();
    toast.success("登录日志导出成功");
  };

  // 清空日志
  const handleClearOperationLogs = async () => {
    try {
      setOperationLogs([]);
      setSelectedOperationLogs([]);
      toast.success("清空操作日志成功");
    } catch (error) {
      toast.error("清空操作日志失败");
    }
  };

  const handleClearLoginLogs = async () => {
    try {
      setLoginLogs([]);
      setSelectedLoginLogs([]);
      toast.success("清空登录日志成功");
    } catch (error) {
      toast.error("清空登录日志失败");
    }
  };

  // 刷新数据
  const handleRefresh = () => {
    fetchLogs();
    toast.success("刷新成功");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">日志管理</h1>
            <p className="text-muted-foreground">
              查看系统操作日志和登录日志
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={handleRefresh} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              刷新
            </Button>
          </div>
        </div>

        <Tabs defaultValue="operation" className="space-y-6">
          <TabsList>
            <TabsTrigger value="operation">操作日志</TabsTrigger>
            <TabsTrigger value="login">登录日志</TabsTrigger>
          </TabsList>

          <TabsContent value="operation" className="space-y-6">
            {/* 搜索和筛选 */}
            <Card>
              <CardHeader>
                <CardTitle>搜索筛选</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="搜索操作模块、操作人员..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={operationStatusFilter} onValueChange={setOperationStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="success">成功</SelectItem>
                      <SelectItem value="error">失败</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={operationTypeFilter} onValueChange={setOperationTypeFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="新增">新增</SelectItem>
                      <SelectItem value="修改">修改</SelectItem>
                      <SelectItem value="删除">删除</SelectItem>
                      <SelectItem value="查询">查询</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 操作日志列表 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>操作日志</CardTitle>
                  <CardDescription>
                    共 {filteredOperationLogs.length} 条记录
                    {selectedOperationLogs.length > 0 && (
                      <span className="ml-2 text-blue-600">
                        已选择 {selectedOperationLogs.length} 条
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {selectedOperationLogs.length > 0 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBatchDeleteOperationLogs}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      批量删除
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportOperationLogs}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    导出
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleClearOperationLogs}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    清空
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedOperationLogs.length === filteredOperationLogs.length && filteredOperationLogs.length > 0}
                          onCheckedChange={handleSelectAllOperationLogs}
                        />
                      </TableHead>
                      <TableHead>系统模块</TableHead>
                      <TableHead>操作类型</TableHead>
                      <TableHead>请求方式</TableHead>
                      <TableHead>操作人员</TableHead>
                      <TableHead>操作地址</TableHead>
                      <TableHead>操作地点</TableHead>
                      <TableHead>操作状态</TableHead>
                      <TableHead>操作日期</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOperationLogs.map((log) => (
                      <TableRow 
                        key={log.id}
                        className={selectedOperationLogs.includes(log.id) ? "bg-muted/50" : ""}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedOperationLogs.includes(log.id)}
                            onCheckedChange={(checked) => handleSelectOperationLog(log.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-slate-500" />
                            {log.title}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.businessType}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{log.requestMethod}</Badge>
                        </TableCell>
                        <TableCell>{log.operName}</TableCell>
                        <TableCell>{log.operIp}</TableCell>
                        <TableCell>{log.operLocation}</TableCell>
                        <TableCell>
                          {getStatusBadge(log.status)}
                        </TableCell>
                        <TableCell>{log.operTime}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>操作</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewOperationLog(log)}>
                                <Eye className="mr-2 h-4 w-4" />
                                详细
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteOperationLog(log.id)}
                                className="text-red-600"
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
          </TabsContent>

          <TabsContent value="login" className="space-y-6">
            {/* 搜索和筛选 */}
            <Card>
              <CardHeader>
                <CardTitle>搜索筛选</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="搜索用户名、IP地址..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={loginStatusFilter} onValueChange={setLoginStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="success">成功</SelectItem>
                      <SelectItem value="failed">失败</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 登录日志列表 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>登录日志</CardTitle>
                  <CardDescription>
                    共 {filteredLoginLogs.length} 条记录
                    {selectedLoginLogs.length > 0 && (
                      <span className="ml-2 text-blue-600">
                        已选择 {selectedLoginLogs.length} 条
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {selectedLoginLogs.length > 0 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBatchDeleteLoginLogs}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      批量删除
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportLoginLogs}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    导出
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleClearLoginLogs}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    清空
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedLoginLogs.length === filteredLoginLogs.length && filteredLoginLogs.length > 0}
                          onCheckedChange={handleSelectAllLoginLogs}
                        />
                      </TableHead>
                      <TableHead>用户名称</TableHead>
                      <TableHead>登录地址</TableHead>
                      <TableHead>登录地点</TableHead>
                      <TableHead>浏览器</TableHead>
                      <TableHead>操作系统</TableHead>
                      <TableHead>登录状态</TableHead>
                      <TableHead>操作信息</TableHead>
                      <TableHead>登录日期</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLoginLogs.map((log) => (
                      <TableRow 
                        key={log.id}
                        className={selectedLoginLogs.includes(log.id) ? "bg-muted/50" : ""}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedLoginLogs.includes(log.id)}
                            onCheckedChange={(checked) => handleSelectLoginLog(log.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-slate-500" />
                            {log.userName}
                          </div>
                        </TableCell>
                        <TableCell>{log.ipaddr}</TableCell>
                        <TableCell>{log.loginLocation}</TableCell>
                        <TableCell>{log.browser}</TableCell>
                        <TableCell>{log.os}</TableCell>
                        <TableCell>
                          {getStatusBadge(log.status)}
                        </TableCell>
                        <TableCell>{log.msg}</TableCell>
                        <TableCell>{log.loginTime}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>操作</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewLoginLog(log)}>
                                <Eye className="mr-2 h-4 w-4" />
                                详细
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteLoginLog(log.id)}
                                className="text-red-600"
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
          </TabsContent>
        </Tabs>

        {/* 登录日志详情对话框 */}
        <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <LogIn className="h-5 w-5" />
                登录日志详情
              </DialogTitle>
              <DialogDescription>
                查看登录日志的详细信息
              </DialogDescription>
            </DialogHeader>
            {viewingLoginLog && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">用户名称</label>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{viewingLoginLog.userName}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">登录状态</label>
                    <div>{getStatusBadge(viewingLoginLog.status)}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">登录IP</label>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <span>{viewingLoginLog.ipaddr}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">登录地点</label>
                    <span>{viewingLoginLog.loginLocation}</span>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">浏览器</label>
                    <span>{viewingLoginLog.browser}</span>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">操作系统</label>
                    <span>{viewingLoginLog.os}</span>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">登录时间</label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{viewingLoginLog.loginTime}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">操作信息</label>
                    <span>{viewingLoginLog.msg}</span>
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