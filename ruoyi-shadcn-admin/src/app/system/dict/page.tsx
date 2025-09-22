"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  BookOpen,
  Filter,
  Eye
} from "lucide-react";
import { toast } from "sonner";

interface Dict {
  id: string;
  name: string;
  type: string;
  status: "active" | "inactive";
  remark?: string;
  createdAt: string;
}

const mockDicts: Dict[] = [
  {
    id: "1",
    name: "用户性别",
    type: "sys_user_sex",
    status: "active",
    remark: "用户性别列表",
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    name: "菜单状态",
    type: "sys_show_hide",
    status: "active",
    remark: "菜单状态列表",
    createdAt: "2024-01-16"
  },
  {
    id: "3",
    name: "系统开关",
    type: "sys_normal_disable",
    status: "active",
    remark: "系统开关列表",
    createdAt: "2024-01-17"
  },
  {
    id: "4",
    name: "任务状态",
    type: "sys_job_status",
    status: "active",
    remark: "任务状态列表",
    createdAt: "2024-01-18"
  },
  {
    id: "5",
    name: "任务分组",
    type: "sys_job_group",
    status: "active",
    remark: "任务分组列表",
    createdAt: "2024-01-19"
  },
  {
    id: "6",
    name: "系统是否",
    type: "sys_yes_no",
    status: "inactive",
    remark: "系统是否列表",
    createdAt: "2024-01-20"
  }
];

export default function DictPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dicts, setDicts] = useState<Dict[]>(mockDicts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingDict, setEditingDict] = useState<Dict | null>(null);
  const [deletingDict, setDeletingDict] = useState<Dict | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    status: "active" as "active" | "inactive",
    remark: ""
  });

  const filteredDicts = dicts.filter(dict =>
    dict.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dict.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 表单验证
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("请输入字典名称");
      return false;
    }
    if (!formData.type.trim()) {
      toast.error("请输入字典类型");
      return false;
    }
    // 检查字典类型是否重复（编辑时排除自身）
    const existingDict = dicts.find(dict => 
      dict.type === formData.type && dict.id !== editingDict?.id
    );
    if (existingDict) {
      toast.error("字典类型已存在");
      return false;
    }
    return true;
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      status: "active",
      remark: ""
    });
    setEditingDict(null);
  };

  // 处理新增
  const handleAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  // 处理编辑
  const handleEdit = (dict: Dict) => {
    setEditingDict(dict);
    setFormData({
      name: dict.name,
      type: dict.type,
      status: dict.status,
      remark: dict.remark || ""
    });
    setIsDialogOpen(true);
  };

  // 处理删除
  const handleDelete = (dict: Dict) => {
    setDeletingDict(dict);
    setIsDeleteDialogOpen(true);
  };

  // 确认删除
  const confirmDelete = async () => {
    if (!deletingDict) return;

    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      setDicts(dicts.filter(dict => dict.id !== deletingDict.id));
      toast.success(`字典 "${deletingDict.name}" 删除成功`);
      setIsDeleteDialogOpen(false);
      setDeletingDict(null);
    } catch (error) {
      toast.error("删除失败，请重试");
    }
  };

  // 处理表单提交
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      if (editingDict) {
        // 编辑字典
        setDicts(dicts.map(dict => 
          dict.id === editingDict.id 
            ? {
                ...dict,
                name: formData.name,
                type: formData.type,
                status: formData.status,
                remark: formData.remark
              }
            : dict
        ));
        toast.success(`字典 "${formData.name}" 更新成功`);
      } else {
        // 新增字典
        const newDict: Dict = {
          id: Date.now().toString(),
          name: formData.name,
          type: formData.type,
          status: formData.status,
          remark: formData.remark,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setDicts([...dicts, newDict]);
        toast.success(`字典 "${formData.name}" 创建成功`);
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("操作失败，请重试");
    }
  };

  const handleView = (dict: Dict) => {
    // 跳转到字典数据管理页面
    window.location.href = `/system/dict/data?type=${dict.type}&name=${encodeURIComponent(dict.name)}`;
  };

  const handleFilter = () => {
    toast.info("筛选字典功能待实现");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">字典管理</h1>
            <p className="text-muted-foreground">
              管理系统数据字典
            </p>
          </div>
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            新增字典
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
                    placeholder="搜索字典名称、类型..."
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

        {/* 字典列表 */}
        <Card>
          <CardHeader>
            <CardTitle>字典列表</CardTitle>
            <CardDescription>
              共 {filteredDicts.length} 个字典
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>字典名称</TableHead>
                  <TableHead>字典类型</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>备注</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDicts.map((dict) => (
                  <TableRow key={dict.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-2 text-slate-500" />
                        {dict.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{dict.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={dict.status === "active" ? "default" : "secondary"}>
                        {dict.status === "active" ? "正常" : "停用"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {dict.remark || "-"}
                    </TableCell>
                    <TableCell>{dict.createdAt}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleView(dict)}>
                            <Eye className="mr-2 h-4 w-4" />
                            字典数据
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(dict)}>
                            <Edit className="mr-2 h-4 w-4" />
                            编辑
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(dict)}
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

        {/* 新增/编辑字典对话框 */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingDict ? "编辑字典" : "新增字典"}
              </DialogTitle>
              <DialogDescription>
                {editingDict ? "修改字典信息" : "创建新的数据字典"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  字典名称 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-3"
                  placeholder="请输入字典名称"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  字典类型 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="col-span-3"
                  placeholder="请输入字典类型"
                  disabled={!!editingDict}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  状态
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "inactive") => 
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">正常</SelectItem>
                    <SelectItem value="inactive">停用</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="remark" className="text-right">
                  备注
                </Label>
                <Textarea
                  id="remark"
                  value={formData.remark}
                  onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                  className="col-span-3"
                  placeholder="请输入备注信息"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSubmit}>
                {editingDict ? "更新" : "创建"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 删除确认对话框 */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认删除</AlertDialogTitle>
              <AlertDialogDescription>
                您确定要删除字典 &ldquo;{deletingDict?.name}&rdquo; 吗？此操作不可撤销。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                删除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}