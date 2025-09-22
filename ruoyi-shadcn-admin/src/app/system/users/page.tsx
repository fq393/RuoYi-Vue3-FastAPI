"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  UserCheck, 
  UserX,
  Filter
} from "lucide-react";
import { toast } from "sonner";
import { UserForm } from "@/components/users/user-form";
import { UserFilter } from "@/components/users/user-filter";

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

const mockUsers: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@example.com",
    name: "系统管理员",
    role: "管理员",
    status: "active",
    avatar: "/avatars/01.png",
    createdAt: "2024-01-15",
    lastLogin: "2024-01-20 10:30"
  },
  {
    id: "2",
    username: "editor",
    email: "editor@example.com",
    name: "编辑员",
    role: "编辑者",
    status: "active",
    avatar: "/avatars/02.png",
    createdAt: "2024-01-16",
    lastLogin: "2024-01-20 09:15"
  },
  {
    id: "3",
    username: "viewer",
    email: "viewer@example.com",
    name: "查看员",
    role: "查看者",
    status: "inactive",
    avatar: "/avatars/03.png",
    createdAt: "2024-01-17",
    lastLogin: "2024-01-19 14:20"
  },
  {
    id: "4",
    username: "test_user",
    email: "test@example.com",
    name: "测试用户",
    role: "普通用户",
    status: "active",
    createdAt: "2024-01-18",
    lastLogin: "2024-01-20 08:45"
  }
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ role: "", status: "" });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !filters.role || user.role === filters.role;
    const matchesStatus = !filters.status || user.status === filters.status;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleStatusToggle = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "active" ? "inactive" : "active" }
        : user
    ));
    toast.success("用户状态已更新");
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast.success("用户已删除");
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsUserFormOpen(true);
  };

  const handleEditUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setEditingUser(user);
      setIsUserFormOpen(true);
    }
  };

  const handleUserSubmit = (userData: Partial<User>) => {
    if (editingUser) {
      // 编辑用户
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...userData }
          : user
      ));
    } else {
      // 新增用户
      const newUser: User = {
        id: userData.id || Date.now().toString(),
        username: userData.username || "",
        email: userData.email || "",
        name: userData.name || "",
        role: userData.role || "普通用户",
        status: userData.status || "active",
        createdAt: userData.createdAt || new Date().toISOString().split('T')[0],
        lastLogin: userData.lastLogin,
      };
      setUsers([...users, newUser]);
    }
  };

  const handleFilterUsers = () => {
    setIsFilterOpen(true);
  };

  const handleApplyFilter = (newFilters: { role: string; status: string }) => {
    setFilters(newFilters);
    toast.success("筛选条件已应用");
  };

  const getStatusBadge = (status: User["status"]) => {
    return status === "active" ? (
      <Badge variant="default" className="bg-green-500">
        <UserCheck className="w-3 h-3 mr-1" />
        活跃
      </Badge>
    ) : (
      <Badge variant="secondary">
        <UserX className="w-3 h-3 mr-1" />
        禁用
      </Badge>
    );
  };

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">用户管理</h2>
            <p className="text-muted-foreground">
              管理系统用户账户和权限
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleAddUser}>
              <Plus className="mr-2 h-4 w-4" />
              新增用户
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>用户列表</CardTitle>
            <CardDescription>
              系统中所有用户的详细信息
            </CardDescription>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索用户..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button variant="outline" size="sm" onClick={handleFilterUsers}>
                <Filter className="mr-2 h-4 w-4" />
                筛选
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户</TableHead>
                  <TableHead>角色</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>最后登录</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.username} • {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user.status)}
                    </TableCell>
                    <TableCell>{user.createdAt}</TableCell>
                    <TableCell>{user.lastLogin || "从未登录"}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            编辑用户
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusToggle(user.id)}>
                            {user.status === "active" ? (
                              <>
                                <UserX className="mr-2 h-4 w-4" />
                                禁用用户
                              </>
                            ) : (
                              <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                启用用户
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            删除用户
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
        
        <UserForm
          open={isUserFormOpen}
          onOpenChange={setIsUserFormOpen}
          user={editingUser}
          onSubmit={handleUserSubmit}
        />
        
        <UserFilter
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          onApplyFilter={handleApplyFilter}
          currentFilters={filters}
        />
      </div>
    </AppLayout>
  );
}