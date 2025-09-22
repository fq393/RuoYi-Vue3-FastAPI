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
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Shield,
  Users,
  Settings,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import { RoleForm } from "@/components/roles/role-form";
import { RolePermissions } from "@/components/roles/role-permissions";

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

const mockRoles: Role[] = [
  {
    id: "1",
    name: "超级管理员",
    code: "super_admin",
    description: "拥有系统所有权限的超级管理员角色",
    userCount: 1,
    permissions: ["*"],
    status: "active",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "2",
    name: "系统管理员",
    code: "admin",
    description: "系统管理员，可管理用户和基础配置",
    userCount: 3,
    permissions: ["user:read", "user:write", "role:read", "system:read"],
    status: "active",
    createdAt: "2024-01-16",
    updatedAt: "2024-01-18"
  },
  {
    id: "3",
    name: "编辑者",
    code: "editor",
    description: "内容编辑者，可编辑和发布内容",
    userCount: 5,
    permissions: ["content:read", "content:write", "media:read", "media:write"],
    status: "active",
    createdAt: "2024-01-17",
    updatedAt: "2024-01-19"
  },
  {
    id: "4",
    name: "查看者",
    code: "viewer",
    description: "只读权限，可查看系统信息",
    userCount: 12,
    permissions: ["dashboard:read", "content:read"],
    status: "active",
    createdAt: "2024-01-18",
    updatedAt: "2024-01-20"
  },
  {
    id: "5",
    name: "测试角色",
    code: "test_role",
    description: "用于测试的临时角色",
    userCount: 0,
    permissions: ["test:read"],
    status: "inactive",
    createdAt: "2024-01-19",
    updatedAt: "2024-01-19"
  }
];

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRoleFormOpen, setIsRoleFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [viewingRole, setViewingRole] = useState<Role | null>(null);

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusToggle = (roleId: string) => {
    setRoles(roles.map(role => 
      role.id === roleId 
        ? { ...role, status: role.status === "active" ? "inactive" : "active" }
        : role
    ));
    toast.success("角色状态已更新");
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role && role.userCount > 0) {
      toast.error("该角色下还有用户，无法删除");
      return;
    }
    setRoles(roles.filter(role => role.id !== roleId));
    toast.success("角色已删除");
  };

  const handleAddRole = () => {
    setEditingRole(null);
    setIsRoleFormOpen(true);
  };

  const handleEditRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role) {
      setEditingRole(role);
      setIsRoleFormOpen(true);
    }
  };

  const handleViewPermissions = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role) {
      setViewingRole(role);
      setIsPermissionsOpen(true);
    }
  };

  const handleRoleSubmit = (roleData: Omit<Role, "id" | "userCount" | "createdAt" | "updatedAt">) => {
    if (editingRole) {
      // 编辑角色
      setRoles(roles.map(role => 
        role.id === editingRole.id 
          ? { 
              ...role, 
              ...roleData, 
              updatedAt: new Date().toISOString().split('T')[0] 
            }
          : role
      ));
    } else {
      // 新增角色
      const newRole: Role = {
        ...roleData,
        id: Date.now().toString(),
        userCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setRoles([...roles, newRole]);
    }
  };

  const getStatusBadge = (status: Role["status"]) => {
    return status === "active" ? (
      <Badge variant="default" className="bg-green-500">
        活跃
      </Badge>
    ) : (
      <Badge variant="secondary">
        禁用
      </Badge>
    );
  };

  const getRoleIcon = (code: string) => {
    if (code.includes("admin")) return <Shield className="w-4 h-4" />;
    if (code.includes("editor")) return <Edit className="w-4 h-4" />;
    if (code.includes("viewer")) return <Eye className="w-4 h-4" />;
    return <Settings className="w-4 h-4" />;
  };

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">角色管理</h2>
            <p className="text-muted-foreground">
              管理系统角色和权限配置
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleAddRole}>
              <Plus className="mr-2 h-4 w-4" />
              新增角色
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                总角色数
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{roles.length}</div>
              <p className="text-xs text-muted-foreground">
                系统中的角色总数
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                活跃角色
              </CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {roles.filter(r => r.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground">
                当前启用的角色数量
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                关联用户
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {roles.reduce((sum, role) => sum + role.userCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                分配了角色的用户总数
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                权限类型
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(roles.flatMap(r => r.permissions)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                系统中的权限类型数
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>角色列表</CardTitle>
            <CardDescription>
              系统中所有角色的详细信息和权限配置
            </CardDescription>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索角色..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>角色信息</TableHead>
                  <TableHead>用户数量</TableHead>
                  <TableHead>权限数量</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>更新时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                          {getRoleIcon(role.code)}
                        </div>
                        <div>
                          <div className="font-medium">{role.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {role.code}
                          </div>
                          <div className="text-xs text-muted-foreground max-w-xs truncate">
                            {role.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{role.userCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {role.permissions.includes("*") ? "全部权限" : `${role.permissions.length} 个权限`}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(role.status)}
                    </TableCell>
                    <TableCell>{role.updatedAt}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">打开菜单</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>操作</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditRole(role.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            编辑角色
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewPermissions(role.id)}>
                            <Shield className="mr-2 h-4 w-4" />
                            权限配置
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusToggle(role.id)}>
                            {role.status === "active" ? "禁用角色" : "启用角色"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteRole(role.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            删除角色
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
      </div>

      <RoleForm
        open={isRoleFormOpen}
        onOpenChange={setIsRoleFormOpen}
        role={editingRole}
        onSubmit={handleRoleSubmit}
      />

      <RolePermissions
        open={isPermissionsOpen}
        onOpenChange={setIsPermissionsOpen}
        role={viewingRole}
      />
    </AppLayout>
  );
}