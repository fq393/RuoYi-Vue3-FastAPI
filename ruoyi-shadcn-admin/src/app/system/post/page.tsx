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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  CreditCard,
  Filter,
  Briefcase,
  Users,
  Building
} from "lucide-react";
import { toast } from "sonner";

interface Post {
  id: string;
  name: string;
  code: string;
  status: "active" | "inactive";
  sort: number;
  remark?: string;
  createdAt: string;
  userCount: number;
}

const mockPosts: Post[] = [
  {
    id: "1",
    name: "总经理",
    code: "CEO",
    status: "active",
    sort: 1,
    remark: "公司最高管理者",
    createdAt: "2024-01-15",
    userCount: 1
  },
  {
    id: "2",
    name: "技术总监",
    code: "CTO",
    status: "active",
    sort: 2,
    remark: "技术部门负责人",
    createdAt: "2024-01-16",
    userCount: 2
  },
  {
    id: "3",
    name: "产品经理",
    code: "PM",
    status: "active",
    sort: 3,
    remark: "产品规划和管理",
    createdAt: "2024-01-17",
    userCount: 3
  },
  {
    id: "4",
    name: "前端工程师",
    code: "FE",
    status: "active",
    sort: 4,
    remark: "前端开发工程师",
    createdAt: "2024-01-18",
    userCount: 5
  },
  {
    id: "5",
    name: "后端工程师",
    code: "BE",
    status: "active",
    sort: 5,
    remark: "后端开发工程师",
    createdAt: "2024-01-19",
    userCount: 4
  },
  {
    id: "6",
    name: "测试工程师",
    code: "QA",
    status: "inactive",
    sort: 6,
    remark: "软件测试工程师",
    createdAt: "2024-01-20",
    userCount: 0
  }
];

export default function PostPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    sort: 1,
    status: "active" as "active" | "inactive",
    remark: ""
  });

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAdd = () => {
    setEditingPost(null);
    setFormData({
      name: "",
      code: "",
      sort: posts.length + 1,
      status: "active",
      remark: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({
      name: post.name,
      code: post.code,
      sort: post.sort,
      status: post.status,
      remark: post.remark || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (post: Post) => {
    if (post.userCount > 0) {
      toast.error(`无法删除岗位"${post.name}"，该岗位下还有${post.userCount}个用户`);
      return;
    }
    
    setPosts(posts.filter(p => p.id !== post.id));
    toast.success(`删除岗位: ${post.name}`);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error("请输入岗位名称");
      return;
    }

    if (!formData.code.trim()) {
      toast.error("请输入岗位编码");
      return;
    }

    // 检查编码是否重复
    const existingPost = posts.find(p => 
      p.code === formData.code && p.id !== editingPost?.id
    );
    if (existingPost) {
      toast.error("岗位编码已存在");
      return;
    }

    if (editingPost) {
      // 编辑岗位
      setPosts(posts.map(post => 
        post.id === editingPost.id 
          ? { ...post, ...formData }
          : post
      ));
      toast.success("岗位更新成功");
    } else {
      // 新增岗位
      const newPost: Post = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        userCount: 0
      };
      setPosts([...posts, newPost]);
      toast.success("岗位添加成功");
    }

    setIsDialogOpen(false);
  };

  const handleStatusToggle = (post: Post) => {
    const newStatus = post.status === "active" ? "inactive" : "active";
    setPosts(posts.map(p => 
      p.id === post.id 
        ? { ...p, status: newStatus }
        : p
    ));
    toast.success(`岗位状态已${newStatus === "active" ? "启用" : "停用"}`);
  };

  const handleFilter = () => {
    toast.info("筛选岗位功能待实现");
  };

  const totalPosts = posts.length;
  const activePosts = posts.filter(p => p.status === "active").length;
  const inactivePosts = posts.filter(p => p.status === "inactive").length;
  const totalUsers = posts.reduce((sum, post) => sum + post.userCount, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">岗位管理</h1>
            <p className="text-muted-foreground">
              管理系统岗位信息和配置
            </p>
          </div>
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            新增岗位
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总岗位数</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPosts}</div>
              <p className="text-xs text-muted-foreground">
                系统中的岗位总数
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">启用岗位</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activePosts}</div>
              <p className="text-xs text-muted-foreground">
                当前启用的岗位
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">停用岗位</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{inactivePosts}</div>
              <p className="text-xs text-muted-foreground">
                当前停用的岗位
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">关联用户</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                岗位关联的用户总数
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 搜索筛选 */}
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
                    placeholder="搜索岗位名称、编码..."
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

        {/* 岗位列表 */}
        <Card>
          <CardHeader>
            <CardTitle>岗位列表</CardTitle>
            <CardDescription>
              共 {filteredPosts.length} 个岗位
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>岗位编号</TableHead>
                  <TableHead>岗位名称</TableHead>
                  <TableHead>岗位编码</TableHead>
                  <TableHead>岗位排序</TableHead>
                  <TableHead>关联用户</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>{post.id}</TableCell>
                    <TableCell className="font-medium">{post.name}</TableCell>
                    <TableCell>
                      <code className="px-2 py-1 bg-muted rounded text-sm">
                        {post.code}
                      </code>
                    </TableCell>
                    <TableCell>{post.sort}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{post.userCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.status === "active" ? "default" : "secondary"}>
                        {post.status === "active" ? "正常" : "停用"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{post.createdAt}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleEdit(post)}>
                            <Edit className="mr-2 h-4 w-4" />
                            编辑
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(post)}
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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? '编辑岗位' : '新增岗位'}
              </DialogTitle>
              <DialogDescription>
                {editingPost ? '修改岗位信息' : '填写岗位基本信息'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">岗位名称 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="请输入岗位名称"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">岗位编码 *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="请输入岗位编码"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort">显示排序</Label>
                <Input
                  id="sort"
                  type="number"
                  value={formData.sort}
                  onChange={(e) => setFormData(prev => ({ ...prev, sort: parseInt(e.target.value) || 1 }))}
                  placeholder="请输入排序号"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">状态</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as "active" | "inactive" }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">启用</SelectItem>
                    <SelectItem value="inactive">停用</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="remark">备注</Label>
                <Textarea
                  id="remark"
                  value={formData.remark}
                  onChange={(e) => setFormData(prev => ({ ...prev, remark: e.target.value }))}
                  placeholder="请输入备注信息"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSubmit}>
                {editingPost ? '更新' : '创建'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}