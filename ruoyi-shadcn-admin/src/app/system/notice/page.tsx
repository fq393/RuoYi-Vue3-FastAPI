"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Bell,
  Filter,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  Info,
  CheckCircle,
  Calendar,
  User
} from "lucide-react";
import { toast } from "sonner";

interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  status: 'published' | 'draft' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  publishTime: string;
  author: string;
  readCount: number;
  isTop: boolean;
  remark?: string;
  createdAt: string;
  updatedAt: string;
}

const mockNotices: Notice[] = [
  {
    id: "1",
    title: "温馨提醒：2024年元旦放假安排",
    content: "根据国家法定节假日安排，2024年元旦放假时间为1月1日，共1天。请各部门做好相关工作安排。",
    type: "info",
    status: "published",
    priority: "medium",
    publishTime: "2024-01-15 09:00:00",
    author: "admin",
    readCount: 156,
    isTop: false,
    remark: "节假日安排",
    createdAt: "2024-01-15 08:30:00",
    updatedAt: "2024-01-15 09:00:00"
  },
  {
    id: "2",
    title: "关于系统升级维护的通知",
    content: "为了提升系统性能，我们将于本周六凌晨2:00-6:00进行系统维护，期间系统将暂停服务。",
    type: "warning",
    status: "published",
    priority: "high",
    publishTime: "2024-01-16 14:30:00",
    author: "admin",
    readCount: 289,
    isTop: true,
    remark: "系统维护",
    createdAt: "2024-01-16 14:00:00",
    updatedAt: "2024-01-16 14:30:00"
  },
  {
    id: "3",
    title: "新版本功能介绍",
    content: "我们很高兴地宣布，系统新增了数据导出功能，用户现在可以将数据导出为Excel、PDF等多种格式。",
    type: "success",
    status: "published",
    priority: "medium",
    publishTime: "2024-01-17 10:15:00",
    author: "admin",
    readCount: 432,
    isTop: false,
    remark: "功能更新",
    createdAt: "2024-01-17 09:45:00",
    updatedAt: "2024-01-17 10:15:00"
  },
  {
    id: "4",
    title: "安全提醒：请及时修改默认密码",
    content: "近期发现有恶意攻击尝试，请各位用户注意账户安全，建议定期更换密码，不要使用弱密码。",
    type: "error",
    status: "published",
    priority: "urgent",
    publishTime: "2024-01-18 11:20:00",
    author: "admin",
    readCount: 678,
    isTop: true,
    remark: "安全警告",
    createdAt: "2024-01-18 10:45:00",
    updatedAt: "2024-01-18 11:20:00"
  },
  {
    id: "5",
    title: "系统使用培训通知",
    content: "为帮助用户更好地使用系统，我们将于下周三下午2:00举办线上培训，主要内容包括系统基础操作、高级功能使用技巧等。",
    type: "info",
    status: "draft",
    priority: "low",
    publishTime: "",
    author: "admin",
    readCount: 0,
    isTop: false,
    remark: "培训活动",
    createdAt: "2024-01-19 15:20:00",
    updatedAt: "2024-01-19 15:20:00"
  },
  {
    id: "6",
    title: "关于加强信息安全管理的通知",
    content: "为进一步加强信息安全管理，现要求所有用户必须启用双因素认证，并定期参加安全培训。",
    type: "warning",
    status: "published",
    priority: "high",
    publishTime: "2024-01-20 16:45:00",
    author: "admin",
    readCount: 234,
    isTop: false,
    remark: "安全管理",
    createdAt: "2024-01-20 16:30:00",
    updatedAt: "2024-01-20 16:45:00"
  }
];

export default function NoticePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [notices, setNotices] = useState<Notice[]>(mockNotices);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'info' as Notice['type'],
    status: 'draft' as Notice['status'],
    priority: 'medium' as Notice['priority'],
    publishTime: '',
    author: '',
    isTop: false,
    remark: ''
  });

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || notice.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || notice.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || notice.priority === priorityFilter;
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  // 处理新增
  const handleAdd = () => {
    setFormData({
      title: "",
      content: "",
      type: "info",
      status: "draft",
      priority: "medium",
      publishTime: "",
      author: "admin",
      isTop: false,
      remark: ""
    });
    setEditingNotice(null);
    setIsDialogOpen(true);
  };

  // 处理编辑
  const handleEdit = (notice: Notice) => {
    setFormData({
      title: notice.title,
      content: notice.content,
      type: notice.type,
      status: notice.status,
      priority: notice.priority,
      publishTime: notice.publishTime,
      author: notice.author,
      isTop: notice.isTop,
      remark: notice.remark || ""
    });
    setEditingNotice(notice);
    setIsDialogOpen(true);
  };

  // 处理删除
  const handleDelete = (notice: Notice) => {
    setNotices(notices.filter(n => n.id !== notice.id));
    toast.success("删除成功");
  };

  // 处理查看
  const handleView = (notice: Notice) => {
    toast.info(`查看通知: ${notice.title}`);
  };

  // 处理表单提交
  const handleSubmit = () => {
    if (!formData.title || !formData.content) {
      toast.error("请填写标题和内容");
      return;
    }

    const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (editingNotice) {
      // 编辑
      setNotices(notices.map(notice => 
        notice.id === editingNotice.id 
          ? { 
              ...notice,
              ...formData,
              updatedAt: currentTime,
              publishTime: formData.status === "published" && !notice.publishTime ? currentTime : formData.publishTime
            }
          : notice
      ));
      toast.success("编辑成功");
    } else {
      // 新增
      const newNotice: Notice = {
        id: Date.now().toString(),
        ...formData,
        readCount: 0,
        createdAt: currentTime,
        updatedAt: currentTime,
        publishTime: formData.status === "published" ? currentTime : ""
      };
      setNotices([newNotice, ...notices]);
      toast.success("新增成功");
    }

    setIsDialogOpen(false);
  };

  const handleFilter = () => {
    toast.info("筛选通知功能待实现");
  };

  const getTypeLabel = (type: Notice['type']) => {
    switch (type) {
      case 'info': return '信息';
      case 'warning': return '警告';
      case 'success': return '成功';
      case 'error': return '错误';
      default: return '未知';
    }
  };

  const getStatusLabel = (status: Notice['status']) => {
    switch (status) {
      case 'published': return '已发布';
      case 'draft': return '草稿';
      case 'archived': return '已归档';
      default: return '未知';
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">通知公告</h1>
            <p className="text-muted-foreground">
              管理系统通知公告信息
            </p>
          </div>
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            新增通知
          </Button>
        </div>

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
                    placeholder="搜索通知标题、创建者..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline" className="flex items-center gap-2" onClick={handleFilter}>
                <Filter className="h-4 w-4" />
                筛选
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 通知列表 */}
        <Card>
          <CardHeader>
            <CardTitle>通知列表</CardTitle>
            <CardDescription>
              共 {filteredNotices.length} 条通知
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>公告标题</TableHead>
                  <TableHead>公告类型</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建者</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotices.map((notice) => (
                  <TableRow key={notice.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Bell className="w-4 h-4 mr-2 text-slate-500" />
                        <div className="max-w-xs truncate">
                          {notice.title}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={notice.type === "error" ? "destructive" : notice.type === "warning" ? "secondary" : "default"}>
                        {getTypeLabel(notice.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={notice.status === "published" ? "default" : "outline"}>
                        {getStatusLabel(notice.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{notice.author}</TableCell>
                    <TableCell>{notice.createdAt}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleView(notice)}>
                            <Eye className="mr-2 h-4 w-4" />
                            查看
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(notice)}>
                            <Edit className="mr-2 h-4 w-4" />
                            编辑
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(notice)}
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

        {/* 新增/编辑对话框 */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingNotice ? "编辑通知" : "新增通知"}</DialogTitle>
              <DialogDescription>
                {editingNotice ? "修改通知信息" : "创建新的通知公告"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  标题
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="col-span-3"
                  placeholder="请输入通知标题"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="content" className="text-right pt-2">
                  内容
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="col-span-3"
                  placeholder="请输入通知内容"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  类型
                </Label>
                <Select value={formData.type} onValueChange={(value: Notice['type']) => setFormData({...formData, type: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择通知类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">信息</SelectItem>
                    <SelectItem value="warning">警告</SelectItem>
                    <SelectItem value="success">成功</SelectItem>
                    <SelectItem value="error">错误</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  状态
                </Label>
                <Select value={formData.status} onValueChange={(value: Notice['status']) => setFormData({...formData, status: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">草稿</SelectItem>
                    <SelectItem value="published">已发布</SelectItem>
                    <SelectItem value="archived">已归档</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  优先级
                </Label>
                <Select value={formData.priority} onValueChange={(value: Notice['priority']) => setFormData({...formData, priority: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择优先级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">低</SelectItem>
                    <SelectItem value="medium">中</SelectItem>
                    <SelectItem value="high">高</SelectItem>
                    <SelectItem value="urgent">紧急</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="remark" className="text-right">
                  备注
                </Label>
                <Input
                  id="remark"
                  value={formData.remark}
                  onChange={(e) => setFormData({...formData, remark: e.target.value})}
                  className="col-span-3"
                  placeholder="请输入备注信息"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSubmit}>
                {editingNotice ? "保存" : "创建"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}