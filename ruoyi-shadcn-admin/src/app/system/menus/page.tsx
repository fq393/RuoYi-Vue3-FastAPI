"use client";

import React, { useState } from "react";
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
  Menu,
  Folder,
  FileText,
  Link,
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "sonner";

interface MenuItem {
  id: string;
  name: string;
  path?: string;
  icon: string;
  type: "menu" | "page" | "button";
  parentId?: string;
  orderNum: number;
  visible: boolean;
  status: "active" | "inactive";
  permission?: string;
  component?: string;
  children?: MenuItem[];
  createdAt: string;
  updatedAt: string;
}

const mockMenus: MenuItem[] = [
  {
    id: "1",
    name: "仪表板",
    path: "/",
    icon: "LayoutDashboard",
    type: "page",
    orderNum: 1,
    visible: true,
    status: "active",
    permission: "dashboard:view",
    component: "Dashboard",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "2",
    name: "系统管理",
    icon: "Settings",
    type: "menu",
    orderNum: 2,
    visible: true,
    status: "active",
    permission: "system:view",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    children: [
      {
        id: "2-1",
        name: "用户管理",
        path: "/system/users",
        icon: "Users",
        type: "page",
        parentId: "2",
        orderNum: 1,
        visible: true,
        status: "active",
        permission: "user:view",
        component: "UserManagement",
        createdAt: "2024-01-15",
        updatedAt: "2024-01-15"
      },
      {
        id: "2-2",
        name: "角色管理",
        path: "/system/roles",
        icon: "Shield",
        type: "page",
        parentId: "2",
        orderNum: 2,
        visible: true,
        status: "active",
        permission: "role:view",
        component: "RoleManagement",
        createdAt: "2024-01-15",
        updatedAt: "2024-01-15"
      },
      {
        id: "2-3",
        name: "菜单管理",
        path: "/system/menus",
        icon: "Menu",
        type: "page",
        parentId: "2",
        orderNum: 3,
        visible: true,
        status: "active",
        permission: "menu:view",
        component: "MenuManagement",
        createdAt: "2024-01-15",
        updatedAt: "2024-01-15"
      }
    ]
  },
  {
    id: "3",
    name: "监控工具",
    icon: "Activity",
    type: "menu",
    orderNum: 3,
    visible: true,
    status: "active",
    permission: "monitor:view",
    createdAt: "2024-01-16",
    updatedAt: "2024-01-16",
    children: [
      {
        id: "3-1",
        name: "系统监控",
        path: "/monitor/system",
        icon: "Monitor",
        type: "page",
        parentId: "3",
        orderNum: 1,
        visible: true,
        status: "active",
        permission: "monitor:system",
        component: "SystemMonitor",
        createdAt: "2024-01-16",
        updatedAt: "2024-01-16"
      },
      {
        id: "3-2",
        name: "操作日志",
        path: "/monitor/logs",
        icon: "FileText",
        type: "page",
        parentId: "3",
        orderNum: 2,
        visible: true,
        status: "active",
        permission: "monitor:logs",
        component: "OperationLogs",
        createdAt: "2024-01-16",
        updatedAt: "2024-01-16"
      }
    ]
  }
];

export default function MenusPage() {
  const [menus, setMenus] = useState<MenuItem[]>(mockMenus);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(["2", "3"]));

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleVisibilityToggle = (menuId: string) => {
    const updateMenuVisibility = (items: MenuItem[]): MenuItem[] => {
      return items.map(item => {
        if (item.id === menuId) {
          return { ...item, visible: !item.visible };
        }
        if (item.children) {
          return { ...item, children: updateMenuVisibility(item.children) };
        }
        return item;
      });
    };
    
    setMenus(updateMenuVisibility(menus));
    toast.success("菜单可见性已更新");
  };

  const handleStatusToggle = (menuId: string) => {
    const updateMenuStatus = (items: MenuItem[]): MenuItem[] => {
      return items.map(item => {
        if (item.id === menuId) {
          return { ...item, status: item.status === "active" ? "inactive" : "active" };
        }
        if (item.children) {
          return { ...item, children: updateMenuStatus(item.children) };
        }
        return item;
      });
    };
    
    setMenus(updateMenuStatus(menus));
    toast.success("菜单状态已更新");
  };

  const handleAddMenu = () => {
    toast.info("新增菜单功能待实现");
  };

  const handleEditMenu = (menuId: string) => {
    toast.info(`编辑菜单 ${menuId} 功能待实现`);
  };

  const handleAddSubMenu = (parentId: string) => {
    toast.info(`为菜单 ${parentId} 添加子菜单功能待实现`);
  };

  const handleDeleteMenu = (menuId: string) => {
    toast.info(`删除菜单 ${menuId} 功能待实现`);
  };

  const getTypeIcon = (type: MenuItem["type"]) => {
    switch (type) {
      case "menu":
        return <Folder className="w-4 h-4" />;
      case "page":
        return <FileText className="w-4 h-4" />;
      case "button":
        return <Link className="w-4 h-4" />;
      default:
        return <Menu className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (type: MenuItem["type"]) => {
    const variants = {
      menu: "default",
      page: "secondary",
      button: "outline"
    } as const;
    
    const labels = {
      menu: "目录",
      page: "页面",
      button: "按钮"
    };

    return (
      <Badge variant={variants[type]}>
        {labels[type]}
      </Badge>
    );
  };

  const getStatusBadge = (status: MenuItem["status"]) => {
    return status === "active" ? (
      <Badge variant="default" className="bg-green-500">
        启用
      </Badge>
    ) : (
      <Badge variant="secondary">
        禁用
      </Badge>
    );
  };

  const renderMenuRow = (menu: MenuItem, level: number = 0): React.ReactNode => {
    const hasChildren = menu.children && menu.children.length > 0;
    const isExpanded = expandedItems.has(menu.id);
    
    return (
      <>
        <TableRow key={menu.id}>
          <TableCell className="font-medium">
            <div className="flex items-center space-x-2" style={{ paddingLeft: `${level * 20}px` }}>
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => toggleExpanded(menu.id)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}
              {!hasChildren && <div className="w-6" />}
              <div className="flex items-center space-x-2">
                {getTypeIcon(menu.type)}
                <span>{menu.name}</span>
              </div>
            </div>
          </TableCell>
          <TableCell>{getTypeBadge(menu.type)}</TableCell>
          <TableCell>
            <code className="text-xs bg-muted px-1 py-0.5 rounded">
              {menu.path || "-"}
            </code>
          </TableCell>
          <TableCell>
            <Badge variant="outline" className="text-xs">
              {menu.permission || "-"}
            </Badge>
          </TableCell>
          <TableCell>{menu.orderNum}</TableCell>
          <TableCell>
            <div className="flex items-center space-x-2">
              {menu.visible ? (
                <Eye className="h-4 w-4 text-green-500" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-sm">
                {menu.visible ? "显示" : "隐藏"}
              </span>
            </div>
          </TableCell>
          <TableCell>{getStatusBadge(menu.status)}</TableCell>
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
                <DropdownMenuItem onClick={() => handleEditMenu(menu.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  编辑菜单
                </DropdownMenuItem>
                {menu.type === "menu" && (
                  <DropdownMenuItem onClick={() => handleAddSubMenu(menu.id)}>
                    <Plus className="mr-2 h-4 w-4" />
                    添加子菜单
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => handleVisibilityToggle(menu.id)}>
                  {menu.visible ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      隐藏菜单
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      显示菜单
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusToggle(menu.id)}>
                  {menu.status === "active" ? "禁用菜单" : "启用菜单"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteMenu(menu.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  删除菜单
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
        {hasChildren && isExpanded && menu.children?.map(child => (
          <React.Fragment key={child.id}>
            {renderMenuRow(child, level + 1)}
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">菜单管理</h2>
            <p className="text-muted-foreground">
              管理系统菜单结构和权限配置
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleAddMenu}>
                <Plus className="mr-2 h-4 w-4" />
                新增菜单
              </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                菜单总数
              </CardTitle>
              <Menu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {menus.reduce((count, menu) => count + 1 + (menu.children?.length || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                包含所有层级的菜单
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                顶级菜单
              </CardTitle>
              <Folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{menus.length}</div>
              <p className="text-xs text-muted-foreground">
                一级菜单数量
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                页面菜单
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {menus.reduce((count, menu) => {
                  const pageCount = menu.type === "page" ? 1 : 0;
                  const childPageCount = menu.children?.filter(child => child.type === "page").length || 0;
                  return count + pageCount + childPageCount;
                }, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                可访问的页面数量
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                隐藏菜单
              </CardTitle>
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {menus.reduce((count, menu) => {
                  const hiddenCount = !menu.visible ? 1 : 0;
                  const childHiddenCount = menu.children?.filter(child => !child.visible).length || 0;
                  return count + hiddenCount + childHiddenCount;
                }, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                不显示的菜单数量
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>菜单列表</CardTitle>
            <CardDescription>
              系统菜单的层级结构和配置信息
            </CardDescription>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索菜单..."
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
                  <TableHead>菜单名称</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>路径</TableHead>
                  <TableHead>权限标识</TableHead>
                  <TableHead>排序</TableHead>
                  <TableHead>可见性</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menus.map(menu => (
                  <React.Fragment key={menu.id}>
                    {renderMenuRow(menu)}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}