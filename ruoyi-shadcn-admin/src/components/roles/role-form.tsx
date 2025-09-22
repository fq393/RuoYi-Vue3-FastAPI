"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  userCount: number;
  permissions: string[];
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

interface RoleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role | null;
  onSubmit: (role: Omit<Role, "id" | "userCount" | "createdAt" | "updatedAt">) => void;
}

// 权限选项
const permissionOptions = [
  { id: "user:read", label: "用户查看", category: "用户管理" },
  { id: "user:write", label: "用户编辑", category: "用户管理" },
  { id: "user:delete", label: "用户删除", category: "用户管理" },
  { id: "role:read", label: "角色查看", category: "角色管理" },
  { id: "role:write", label: "角色编辑", category: "角色管理" },
  { id: "role:delete", label: "角色删除", category: "角色管理" },
  { id: "system:read", label: "系统查看", category: "系统管理" },
  { id: "system:write", label: "系统配置", category: "系统管理" },
  { id: "content:read", label: "内容查看", category: "内容管理" },
  { id: "content:write", label: "内容编辑", category: "内容管理" },
  { id: "media:read", label: "媒体查看", category: "媒体管理" },
  { id: "media:write", label: "媒体上传", category: "媒体管理" },
  { id: "dashboard:read", label: "仪表盘查看", category: "仪表盘" },
  { id: "test:read", label: "测试权限", category: "测试" },
];

// 按类别分组权限
const groupedPermissions = permissionOptions.reduce((acc, permission) => {
  if (!acc[permission.category]) {
    acc[permission.category] = [];
  }
  acc[permission.category].push(permission);
  return acc;
}, {} as Record<string, typeof permissionOptions>);

export function RoleForm({ open, onOpenChange, role, onSubmit }: RoleFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    permissions: [] as string[],
    status: "active" as "active" | "inactive",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        code: role.code,
        description: role.description,
        permissions: role.permissions,
        status: role.status,
      });
    } else {
      setFormData({
        name: "",
        code: "",
        description: "",
        permissions: [],
        status: "active",
      });
    }
    setErrors({});
  }, [role, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "角色名称不能为空";
    }

    if (!formData.code.trim()) {
      newErrors.code = "角色编码不能为空";
    } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(formData.code)) {
      newErrors.code = "角色编码只能包含字母、数字和下划线，且不能以数字开头";
    }

    if (!formData.description.trim()) {
      newErrors.description = "角色描述不能为空";
    }

    if (formData.permissions.length === 0) {
      newErrors.permissions = "至少选择一个权限";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit(formData);
      toast.success(role ? "角色更新成功" : "角色创建成功");
      onOpenChange(false);
    } catch (error) {
      toast.error("操作失败，请重试");
    }
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(p => p !== permissionId)
    }));
  };

  const handleSelectAllInCategory = (category: string, checked: boolean) => {
    const categoryPermissions = groupedPermissions[category].map(p => p.id);
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...new Set([...prev.permissions, ...categoryPermissions])]
        : prev.permissions.filter(p => !categoryPermissions.includes(p))
    }));
  };

  const isCategoryFullySelected = (category: string) => {
    const categoryPermissions = groupedPermissions[category].map(p => p.id);
    return categoryPermissions.every(p => formData.permissions.includes(p));
  };

  const isCategoryPartiallySelected = (category: string) => {
    const categoryPermissions = groupedPermissions[category].map(p => p.id);
    return categoryPermissions.some(p => formData.permissions.includes(p)) && 
           !categoryPermissions.every(p => formData.permissions.includes(p));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{role ? "编辑角色" : "新增角色"}</DialogTitle>
          <DialogDescription>
            {role ? "修改角色信息和权限配置" : "创建新的角色并配置权限"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">角色名称 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="请输入角色名称"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">角色编码 *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                placeholder="请输入角色编码"
                className={errors.code ? "border-red-500" : ""}
              />
              {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">角色描述 *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="请输入角色描述"
              className={errors.description ? "border-red-500" : ""}
              rows={3}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="status"
              checked={formData.status === "active"}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, status: checked ? "active" : "inactive" }))
              }
            />
            <Label htmlFor="status">启用角色</Label>
          </div>

          <div className="space-y-4">
            <div>
              <Label>权限配置 *</Label>
              {errors.permissions && <p className="text-sm text-red-500">{errors.permissions}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(groupedPermissions).map(([category, permissions]) => (
                <Card key={category}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={isCategoryFullySelected(category)}
                        onCheckedChange={(checked) => 
                          handleSelectAllInCategory(category, checked as boolean)
                        }
                        className={isCategoryPartiallySelected(category) ? "data-[state=checked]:bg-orange-500" : ""}
                      />
                      <CardTitle className="text-sm">{category}</CardTitle>
                    </div>
                    <Separator className="mt-3" />
                  </CardHeader>
                  <CardContent className="pt-3">
                    <div className="space-y-2">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission.id}
                            checked={formData.permissions.includes(permission.id)}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(permission.id, checked as boolean)
                            }
                          />
                          <Label htmlFor={permission.id} className="text-sm">
                            {permission.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit">
              {role ? "更新" : "创建"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}