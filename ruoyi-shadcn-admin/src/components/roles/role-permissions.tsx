"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Check, X } from "lucide-react";

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

interface RolePermissionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
}

// 权限选项
const permissionOptions = [
  { id: "user:read", label: "用户查看", category: "用户管理", description: "查看用户列表和详细信息" },
  { id: "user:write", label: "用户编辑", category: "用户管理", description: "创建、编辑用户信息" },
  { id: "user:delete", label: "用户删除", category: "用户管理", description: "删除用户账户" },
  { id: "role:read", label: "角色查看", category: "角色管理", description: "查看角色列表和权限" },
  { id: "role:write", label: "角色编辑", category: "角色管理", description: "创建、编辑角色和权限" },
  { id: "role:delete", label: "角色删除", category: "角色管理", description: "删除角色" },
  { id: "system:read", label: "系统查看", category: "系统管理", description: "查看系统配置和状态" },
  { id: "system:write", label: "系统配置", category: "系统管理", description: "修改系统配置" },
  { id: "content:read", label: "内容查看", category: "内容管理", description: "查看内容和文章" },
  { id: "content:write", label: "内容编辑", category: "内容管理", description: "创建、编辑内容" },
  { id: "media:read", label: "媒体查看", category: "媒体管理", description: "查看媒体文件" },
  { id: "media:write", label: "媒体上传", category: "媒体管理", description: "上传、管理媒体文件" },
  { id: "dashboard:read", label: "仪表盘查看", category: "仪表盘", description: "查看仪表盘数据" },
  { id: "test:read", label: "测试权限", category: "测试", description: "测试功能权限" },
];

// 按类别分组权限
const groupedPermissions = permissionOptions.reduce((acc, permission) => {
  if (!acc[permission.category]) {
    acc[permission.category] = [];
  }
  acc[permission.category].push(permission);
  return acc;
}, {} as Record<string, typeof permissionOptions>);

export function RolePermissions({ open, onOpenChange, role }: RolePermissionsProps) {
  if (!role) return null;

  const hasPermission = (permissionId: string) => {
    return role.permissions.includes("*") || role.permissions.includes(permissionId);
  };

  const getPermissionCount = (category: string) => {
    const categoryPermissions = groupedPermissions[category];
    const grantedCount = categoryPermissions.filter(p => hasPermission(p.id)).length;
    return { granted: grantedCount, total: categoryPermissions.length };
  };

  const isFullAccess = role.permissions.includes("*");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>角色权限详情</span>
          </DialogTitle>
          <DialogDescription>
            查看角色 "{role.name}" 的详细权限配置
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 角色基本信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">角色名称</div>
                  <div className="text-base">{role.name}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">角色编码</div>
                  <div className="text-base font-mono">{role.code}</div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">角色描述</div>
                <div className="text-base">{role.description}</div>
              </div>
              <div className="flex items-center space-x-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">状态</div>
                  <Badge variant={role.status === "active" ? "default" : "secondary"} className={role.status === "active" ? "bg-green-500" : ""}>
                    {role.status === "active" ? "活跃" : "禁用"}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">用户数量</div>
                  <div className="text-base">{role.userCount} 个用户</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 权限概览 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">权限概览</CardTitle>
              <CardDescription>
                {isFullAccess ? (
                  <div className="flex items-center space-x-2 text-orange-600">
                    <Shield className="h-4 w-4" />
                    <span>该角色拥有系统全部权限</span>
                  </div>
                ) : (
                  `该角色共拥有 ${role.permissions.length} 个权限`
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isFullAccess ? (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-orange-800">
                    <Shield className="h-5 w-5" />
                    <span className="font-medium">超级管理员权限</span>
                  </div>
                  <p className="text-sm text-orange-700 mt-1">
                    此角色拥有系统的所有权限，包括用户管理、角色管理、系统配置等全部功能。
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(groupedPermissions).map(([category, permissions]) => {
                    const { granted, total } = getPermissionCount(category);
                    const percentage = (granted / total) * 100;
                    
                    return (
                      <div key={category} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{category}</span>
                          <Badge variant="outline" className="text-xs">
                            {granted}/{total}
                          </Badge>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 详细权限列表 */}
          {!isFullAccess && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">详细权限</CardTitle>
                <CardDescription>
                  按功能模块查看具体权限配置
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(groupedPermissions).map(([category, permissions]) => (
                  <div key={category}>
                    <div className="flex items-center space-x-2 mb-3">
                      <h4 className="text-base font-medium">{category}</h4>
                      <Badge variant="outline" className="text-xs">
                        {getPermissionCount(category).granted}/{getPermissionCount(category).total}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {permissions.map((permission) => {
                        const granted = hasPermission(permission.id);
                        return (
                          <div key={permission.id} className="flex items-center space-x-3 p-2 rounded-lg border">
                            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                              granted ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                            }`}>
                              {granted ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className={`text-sm font-medium ${granted ? "text-gray-900" : "text-gray-500"}`}>
                                  {permission.label}
                                </span>
                                <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                                  {permission.id}
                                </code>
                              </div>
                              <p className={`text-xs ${granted ? "text-gray-600" : "text-gray-400"}`}>
                                {permission.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {category !== Object.keys(groupedPermissions)[Object.keys(groupedPermissions).length - 1] && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}