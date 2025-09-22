"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
  Building2,
  Filter,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

interface Department {
  id: string;
  name: string;
  parentId?: string;
  leader: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  sort: number;
  createdAt: string;
  children?: Department[];
}

const mockDepartments: Department[] = [
  {
    id: "1",
    name: "总公司",
    leader: "张三",
    phone: "15888888888",
    email: "admin@company.com",
    status: "active",
    sort: 1,
    createdAt: "2024-01-15",
    children: [
      {
        id: "2",
        name: "技术部",
        parentId: "1",
        leader: "李四",
        phone: "15666666666",
        email: "tech@company.com",
        status: "active",
        sort: 1,
        createdAt: "2024-01-16",
        children: [
          {
            id: "3",
            name: "前端组",
            parentId: "2",
            leader: "王五",
            phone: "15555555555",
            email: "frontend@company.com",
            status: "active",
            sort: 1,
            createdAt: "2024-01-17"
          },
          {
            id: "4",
            name: "后端组",
            parentId: "2",
            leader: "赵六",
            phone: "15444444444",
            email: "backend@company.com",
            status: "active",
            sort: 2,
            createdAt: "2024-01-17"
          }
        ]
      },
      {
        id: "5",
        name: "市场部",
        parentId: "1",
        leader: "钱七",
        phone: "15333333333",
        email: "market@company.com",
        status: "active",
        sort: 2,
        createdAt: "2024-01-16"
      }
    ]
  }
];

export default function DeptPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    parentId: "none",
    leader: "",
    phone: "",
    email: "",
    status: "active" as "active" | "inactive",
    sort: 1
  });

  // 重置表单
  const resetForm = () => {
    setFormData({
      name: "",
      parentId: "none",
      leader: "",
      phone: "",
      email: "",
      status: "active",
      sort: 1
    });
    setEditingDept(null);
  };

  // 验证表单
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("请输入部门名称");
      return false;
    }
    if (!formData.leader.trim()) {
      toast.error("请输入负责人");
      return false;
    }
    if (formData.phone && !/^1[3-9]\d{9}$/.test(formData.phone)) {
      toast.error("请输入正确的手机号码");
      return false;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("请输入正确的邮箱地址");
      return false;
    }
    return true;
  };

  // 获取所有部门的扁平化列表（用于父级部门选择）
  const flattenDepartments = (depts: Department[], level: number = 0): Array<Department & { level: number }> => {
    const result: Array<Department & { level: number }> = [];
    depts.forEach(dept => {
      result.push({ ...dept, level });
      if (dept.children) {
        result.push(...flattenDepartments(dept.children, level + 1));
      }
    });
    return result;
  };

  // 获取父级部门选项（排除当前编辑的部门及其子部门）
  const getParentDeptOptions = () => {
    const flatDepts = flattenDepartments(departments);
    if (!editingDept) return flatDepts;
    
    // 排除当前部门及其子部门
    const excludeIds = new Set<string>();
    const addExcludeIds = (dept: Department) => {
      excludeIds.add(dept.id);
      if (dept.children) {
        dept.children.forEach(addExcludeIds);
      }
    };
    addExcludeIds(editingDept);
    
    return flatDepts.filter(dept => !excludeIds.has(dept.id));
  };

  // 处理新增
  const handleAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  // 处理编辑
  const handleEdit = (dept: Department) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      parentId: dept.parentId || "none",
      leader: dept.leader,
      phone: dept.phone,
      email: dept.email,
      status: dept.status,
      sort: dept.sort
    });
    setIsDialogOpen(true);
  };

  // 处理删除
  const handleDelete = (dept: Department) => {
    if (dept.children && dept.children.length > 0) {
      toast.error("该部门下还有子部门，无法删除");
      return;
    }
    
    // 递归删除部门
    const removeDept = (depts: Department[], targetId: string): Department[] => {
      return depts.filter(d => d.id !== targetId).map(d => ({
        ...d,
        children: d.children ? removeDept(d.children, targetId) : undefined
      }));
    };

    setDepartments(removeDept(departments, dept.id));
    toast.success(`部门 "${dept.name}" 删除成功`);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      if (editingDept) {
        // 编辑部门
        const updateDept = (depts: Department[]): Department[] => {
          return depts.map(dept => {
            if (dept.id === editingDept.id) {
              return {
                ...dept,
                name: formData.name,
                parentId: formData.parentId === "none" ? undefined : formData.parentId,
                leader: formData.leader,
                phone: formData.phone,
                email: formData.email,
                status: formData.status,
                sort: formData.sort,
                createdAt: dept.createdAt // 保持创建时间不变
              };
            }
            if (dept.children) {
              return {
                ...dept,
                children: updateDept(dept.children)
              };
            }
            return dept;
          });
        };

        setDepartments(updateDept(departments));
        toast.success(`部门 "${formData.name}" 更新成功`);
      } else {
        // 新增部门
        const newDept: Department = {
          id: Date.now().toString(),
          name: formData.name,
          parentId: formData.parentId === "none" ? undefined : formData.parentId,
          leader: formData.leader,
          phone: formData.phone,
          email: formData.email,
          status: formData.status,
          sort: formData.sort,
          createdAt: new Date().toISOString().split('T')[0]
        };

        if (formData.parentId && formData.parentId !== "none") {
          // 添加到指定父部门
          const addToParent = (depts: Department[]): Department[] => {
            return depts.map(dept => {
              if (dept.id === formData.parentId) {
                return {
                  ...dept,
                  children: [...(dept.children || []), newDept]
                };
              }
              if (dept.children) {
                return {
                  ...dept,
                  children: addToParent(dept.children)
                };
              }
              return dept;
            });
          };
          setDepartments(addToParent(departments));
        } else {
          // 添加为顶级部门
          setDepartments([...departments, newDept]);
        }

        toast.success(`部门 "${formData.name}" 创建成功`);
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("操作失败，请重试");
    }
  };

  const handleFilter = () => {
    toast.info("筛选部门功能待实现");
  };

  const renderDepartmentRow = (dept: Department, level: number = 0) => {
    const rows = [];
    
    rows.push(
      <TableRow key={dept.id}>
        <TableCell>
          <div className="flex items-center" style={{ paddingLeft: `${level * 20}px` }}>
            {dept.children && dept.children.length > 0 && (
              <ChevronRight className="w-4 h-4 mr-2" />
            )}
            <Building2 className="w-4 h-4 mr-2 text-slate-500" />
            {dept.name}
          </div>
        </TableCell>
        <TableCell>{dept.leader}</TableCell>
        <TableCell>{dept.phone}</TableCell>
        <TableCell>{dept.email}</TableCell>
        <TableCell>
          <Badge variant={dept.status === "active" ? "default" : "secondary"}>
            {dept.status === "active" ? "正常" : "停用"}
          </Badge>
        </TableCell>
        <TableCell>{dept.sort}</TableCell>
        <TableCell>{dept.createdAt}</TableCell>
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
              <DropdownMenuItem onClick={() => handleEdit(dept)}>
                <Edit className="mr-2 h-4 w-4" />
                编辑
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDelete(dept)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );

    if (dept.children) {
      dept.children.forEach(child => {
        rows.push(...renderDepartmentRow(child, level + 1));
      });
    }

    return rows;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">部门管理</h1>
            <p className="text-muted-foreground">
              管理组织架构和部门信息
            </p>
          </div>
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            新增部门
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
                    placeholder="搜索部门名称、负责人..."
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

        {/* 部门列表 */}
        <Card>
          <CardHeader>
            <CardTitle>部门列表</CardTitle>
            <CardDescription>
              共 {departments.length} 个部门
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>部门名称</TableHead>
                  <TableHead>负责人</TableHead>
                  <TableHead>联系电话</TableHead>
                  <TableHead>邮箱</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>排序</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map(dept => renderDepartmentRow(dept))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 部门表单对话框 */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingDept ? "编辑部门" : "新增部门"}
              </DialogTitle>
              <DialogDescription>
                {editingDept ? "修改部门信息" : "创建新的部门"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  部门名称 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-3"
                  placeholder="请输入部门名称"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="parentId" className="text-right">
                  上级部门
                </Label>
                <Select
                  value={formData.parentId}
                  onValueChange={(value) => setFormData({ ...formData, parentId: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="请选择上级部门" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">无上级部门</SelectItem>
                    {getParentDeptOptions().map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {"　".repeat(dept.level)}{dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="leader" className="text-right">
                  负责人 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="leader"
                  value={formData.leader}
                  onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                  className="col-span-3"
                  placeholder="请输入负责人姓名"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  联系电话
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="col-span-3"
                  placeholder="请输入联系电话"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  邮箱地址
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="col-span-3"
                  placeholder="请输入邮箱地址"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  部门状态
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">正常</SelectItem>
                    <SelectItem value="inactive">停用</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sort" className="text-right">
                  显示排序
                </Label>
                <Input
                  id="sort"
                  type="number"
                  value={formData.sort}
                  onChange={(e) => setFormData({ ...formData, sort: parseInt(e.target.value) || 1 })}
                  className="col-span-3"
                  placeholder="请输入排序号"
                  min="1"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSubmit}>
                {editingDept ? "更新" : "创建"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}