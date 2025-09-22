"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
  status: "active" | "inactive";
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  onSubmit: (userData: Partial<User>) => void;
}

export function UserForm({ open, onOpenChange, user, onSubmit }: UserFormProps) {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    name: user?.name || "",
    role: user?.role || "普通用户",
    status: user?.status || "active" as "active" | "inactive",
  });

  const [loading, setLoading] = useState(false);

  // 监听user属性变化，更新表单数据
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        name: user.name || "",
        role: user.role || "普通用户",
        status: user.status || "active",
      });
    } else {
      // 新增用户时重置表单
      setFormData({
        username: "",
        email: "",
        name: "",
        role: "普通用户",
        status: "active",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email || !formData.name) {
      toast.error("请填写所有必填字段");
      return;
    }

    setLoading(true);
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        ...formData,
        id: user?.id || Date.now().toString(),
        createdAt: user?.createdAt || new Date().toISOString().split('T')[0],
        lastLogin: user?.lastLogin,
      };
      
      onSubmit(userData);
      toast.success(user ? "用户更新成功" : "用户创建成功");
      onOpenChange(false);
      
      // 重置表单
      if (!user) {
        setFormData({
          username: "",
          email: "",
          name: "",
          role: "普通用户",
          status: "active",
        });
      }
    } catch (error) {
      toast.error("操作失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? "编辑用户" : "新增用户"}</DialogTitle>
          <DialogDescription>
            {user ? "修改用户信息" : "填写用户基本信息"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">用户名 *</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="请输入用户名"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">姓名 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="请输入姓名"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">邮箱 *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="请输入邮箱地址"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">角色</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleInputChange("role", value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="管理员">管理员</SelectItem>
                <SelectItem value="编辑者">编辑者</SelectItem>
                <SelectItem value="查看者">查看者</SelectItem>
                <SelectItem value="普通用户">普通用户</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">状态</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value as "active" | "inactive")}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">活跃</SelectItem>
                <SelectItem value="inactive">禁用</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "处理中..." : (user ? "更新" : "创建")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}