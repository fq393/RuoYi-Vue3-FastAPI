"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ArrowLeft,
  BookOpen,
} from "lucide-react";

// 字典数据接口
interface DictData {
  id: number;
  dictCode: number;
  dictSort: number;
  dictLabel: string;
  dictValue: string;
  dictType: string;
  cssClass?: string;
  listClass?: string;
  isDefault: "Y" | "N";
  status: "active" | "inactive";
  remark?: string;
  createTime: string;
}

// 模拟字典数据
const mockDictData: DictData[] = [
  {
    id: 1,
    dictCode: 1,
    dictSort: 1,
    dictLabel: "男",
    dictValue: "0",
    dictType: "sys_user_sex",
    cssClass: "",
    listClass: "default",
    isDefault: "Y",
    status: "active",
    remark: "性别男",
    createTime: "2024-01-15 10:30:00",
  },
  {
    id: 2,
    dictCode: 2,
    dictSort: 2,
    dictLabel: "女",
    dictValue: "1",
    dictType: "sys_user_sex",
    cssClass: "",
    listClass: "default",
    isDefault: "N",
    status: "active",
    remark: "性别女",
    createTime: "2024-01-15 10:31:00",
  },
  {
    id: 3,
    dictCode: 3,
    dictSort: 3,
    dictLabel: "未知",
    dictValue: "2",
    dictType: "sys_user_sex",
    cssClass: "",
    listClass: "default",
    isDefault: "N",
    status: "inactive",
    remark: "性别未知",
    createTime: "2024-01-15 10:32:00",
  },
];

export default function DictDataPage() {
  const searchParams = useSearchParams();
  const dictType = searchParams.get("type") || "";
  const dictName = searchParams.get("name") || "";

  const [searchTerm, setSearchTerm] = useState("");
  const [dictDataList, setDictDataList] = useState<DictData[]>(mockDictData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingDictData, setEditingDictData] = useState<DictData | null>(null);
  const [deletingDictData, setDeletingDictData] = useState<DictData | null>(null);
  const [formData, setFormData] = useState({
    dictLabel: "",
    dictValue: "",
    dictSort: 0,
    cssClass: "",
    listClass: "",
    isDefault: "N" as "Y" | "N",
    status: "active" as "active" | "inactive",
    remark: "",
  });

  // 筛选字典数据
  const filteredDictData = dictDataList.filter((item) =>
    item.dictLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.dictValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.remark && item.remark.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 表单验证
  const validateForm = () => {
    if (!formData.dictLabel.trim()) {
      toast.error("请输入字典标签");
      return false;
    }
    if (!formData.dictValue.trim()) {
      toast.error("请输入字典键值");
      return false;
    }
    return true;
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      dictLabel: "",
      dictValue: "",
      dictSort: 0,
      cssClass: "",
      listClass: "",
      isDefault: "N",
      status: "active",
      remark: "",
    });
    setEditingDictData(null);
  };

  // 处理新增
  const handleAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  // 处理编辑
  const handleEdit = (dictData: DictData) => {
    setFormData({
      dictLabel: dictData.dictLabel,
      dictValue: dictData.dictValue,
      dictSort: dictData.dictSort,
      cssClass: dictData.cssClass || "",
      listClass: dictData.listClass || "",
      isDefault: dictData.isDefault,
      status: dictData.status,
      remark: dictData.remark || "",
    });
    setEditingDictData(dictData);
    setIsDialogOpen(true);
  };

  // 处理删除
  const handleDelete = (dictData: DictData) => {
    setDeletingDictData(dictData);
    setIsDeleteDialogOpen(true);
  };

  // 确认删除
  const confirmDelete = () => {
    if (deletingDictData) {
      setDictDataList(prev => prev.filter(item => item.id !== deletingDictData.id));
      toast.success(`字典数据 "${deletingDictData.dictLabel}" 删除成功`);
      setDeletingDictData(null);
      setIsDeleteDialogOpen(false);
    }
  };

  // 处理提交
  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editingDictData) {
      // 编辑
      setDictDataList(prev => prev.map(item => 
        item.id === editingDictData.id 
          ? { 
              ...item, 
              ...formData,
              dictType: dictType,
            }
          : item
      ));
      toast.success("字典数据更新成功");
    } else {
      // 新增
      const newDictData: DictData = {
        id: Date.now(),
        dictCode: Date.now(),
        ...formData,
        dictType: dictType,
        createTime: new Date().toLocaleString(),
      };
      setDictDataList(prev => [...prev, newDictData]);
      toast.success("字典数据创建成功");
    }

    setIsDialogOpen(false);
    resetForm();
  };

  // 处理筛选
  const handleFilter = () => {
    toast.info("筛选功能待实现");
  };

  // 返回字典管理
  const handleBack = () => {
    window.location.href = "/system/dict";
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              返回
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">字典数据管理</h1>
              <p className="text-muted-foreground">
                管理字典类型 &ldquo;{dictName}&rdquo; ({dictType}) 的数据项
              </p>
            </div>
          </div>
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            新增数据
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
                    placeholder="搜索字典标签、键值、备注..."
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

        {/* 字典数据列表 */}
        <Card>
          <CardHeader>
            <CardTitle>字典数据列表</CardTitle>
            <CardDescription>
              共 {filteredDictData.length} 条数据
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>字典标签</TableHead>
                  <TableHead>字典键值</TableHead>
                  <TableHead>排序</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>默认</TableHead>
                  <TableHead>备注</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDictData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-2 text-slate-500" />
                        {item.dictLabel}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.dictValue}</Badge>
                    </TableCell>
                    <TableCell>{item.dictSort}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "active" ? "default" : "secondary"}>
                        {item.status === "active" ? "正常" : "停用"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.isDefault === "Y" ? "default" : "outline"}>
                        {item.isDefault === "Y" ? "是" : "否"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {item.remark || "-"}
                    </TableCell>
                    <TableCell>{item.createTime}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                          className="flex items-center gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          编辑
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                          删除
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 新增/编辑字典数据对话框 */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingDictData ? "编辑字典数据" : "新增字典数据"}
              </DialogTitle>
              <DialogDescription>
                {editingDictData ? "修改字典数据信息" : "创建新的字典数据项"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dictLabel" className="text-right">
                  字典标签 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dictLabel"
                  value={formData.dictLabel}
                  onChange={(e) => setFormData({ ...formData, dictLabel: e.target.value })}
                  className="col-span-3"
                  placeholder="请输入字典标签"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dictValue" className="text-right">
                  字典键值 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dictValue"
                  value={formData.dictValue}
                  onChange={(e) => setFormData({ ...formData, dictValue: e.target.value })}
                  className="col-span-3"
                  placeholder="请输入字典键值"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dictSort" className="text-right">
                  显示排序
                </Label>
                <Input
                  id="dictSort"
                  type="number"
                  value={formData.dictSort}
                  onChange={(e) => setFormData({ ...formData, dictSort: parseInt(e.target.value) || 0 })}
                  className="col-span-3"
                  placeholder="请输入显示排序"
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
                <Label htmlFor="isDefault" className="text-right">
                  是否默认
                </Label>
                <Select
                  value={formData.isDefault}
                  onValueChange={(value: "Y" | "N") => 
                    setFormData({ ...formData, isDefault: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择是否默认" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Y">是</SelectItem>
                    <SelectItem value="N">否</SelectItem>
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
                {editingDictData ? "更新" : "创建"}
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
                您确定要删除字典数据 &ldquo;{deletingDictData?.dictLabel}&rdquo; 吗？此操作不可撤销。
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