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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Menu,
  ChevronRight,
  ChevronDown,
  Folder,
  FileText,
  Link,
  Eye,
  EyeOff,
  AlertTriangle,
  Maximize2,
  Minimize2
} from "lucide-react";
import { toast } from "sonner";

interface MenuItem {
  id: string;
  name: string;
  parentId?: string;
  path?: string;
  component?: string;
  icon?: string;
  type: "directory" | "menu" | "button";
  visible: boolean;
  status: "active" | "inactive";
  perms?: string;
  sort: number;
  remark?: string;
  createdAt: string;
  children?: MenuItem[];
}

const mockMenus: MenuItem[] = [
  {
    id: "1",
    name: "系统管理",
    type: "directory",
    icon: "Settings",
    visible: true,
    status: "active",
    sort: 1,
    createdAt: "2024-01-15",
    children: [
      {
        id: "2",
        name: "用户管理",
        parentId: "1",
        path: "/system/users",
        component: "system/users/index",
        type: "menu",
        icon: "Users",
        visible: true,
        status: "active",
        perms: "system:user:list",
        sort: 1,
        createdAt: "2024-01-15",
        children: [
          {
            id: "3",
            name: "用户查询",
            parentId: "2",
            type: "button",
            visible: true,
            status: "active",
            perms: "system:user:query",
            sort: 1,
            createdAt: "2024-01-15"
          },
          {
            id: "4",
            name: "用户新增",
            parentId: "2",
            type: "button",
            visible: true,
            status: "active",
            perms: "system:user:add",
            sort: 2,
            createdAt: "2024-01-15"
          },
          {
            id: "5",
            name: "用户修改",
            parentId: "2",
            type: "button",
            visible: true,
            status: "active",
            perms: "system:user:edit",
            sort: 3,
            createdAt: "2024-01-15"
          },
          {
            id: "6",
            name: "用户删除",
            parentId: "2",
            type: "button",
            visible: true,
            status: "active",
            perms: "system:user:remove",
            sort: 4,
            createdAt: "2024-01-15"
          }
        ]
      },
      {
        id: "7",
        name: "角色管理",
        parentId: "1",
        path: "/system/roles",
        component: "system/roles/index",
        type: "menu",
        icon: "Shield",
        visible: true,
        status: "active",
        perms: "system:role:list",
        sort: 2,
        createdAt: "2024-01-15"
      },
      {
        id: "10",
        name: "菜单管理",
        parentId: "1",
        path: "/system/menu",
        component: "system/menu/index",
        type: "menu",
        icon: "Menu",
        visible: true,
        status: "active",
        perms: "system:menu:list",
        sort: 3,
        createdAt: "2024-01-15"
      },
      {
        id: "11",
        name: "部门管理",
        parentId: "1",
        path: "/system/dept",
        component: "system/dept/index",
        type: "menu",
        icon: "Building",
        visible: true,
        status: "active",
        perms: "system:dept:list",
        sort: 4,
        createdAt: "2024-01-15"
      },
      {
        id: "12",
        name: "岗位管理",
        parentId: "1",
        path: "/system/post",
        component: "system/post/index",
        type: "menu",
        icon: "Briefcase",
        visible: true,
        status: "active",
        perms: "system:post:list",
        sort: 5,
        createdAt: "2024-01-15"
      },
      {
        id: "13",
        name: "字典管理",
        parentId: "1",
        path: "/system/dict",
        component: "system/dict/index",
        type: "menu",
        icon: "BookOpen",
        visible: true,
        status: "active",
        perms: "system:dict:list",
        sort: 6,
        createdAt: "2024-01-15"
      }
    ]
  },
  {
    id: "8",
    name: "系统监控",
    type: "directory",
    icon: "Monitor",
    visible: true,
    status: "active",
    sort: 2,
    createdAt: "2024-01-15",
    children: [
      {
        id: "9",
        name: "在线用户",
        parentId: "8",
        path: "/monitor/online",
        component: "monitor/online/index",
        type: "menu",
        icon: "Users",
        visible: true,
        status: "active",
        perms: "monitor:online:list",
        sort: 1,
        createdAt: "2024-01-15"
      },
      {
        id: "14",
        name: "服务监控",
        parentId: "8",
        path: "/monitor/server",
        component: "monitor/server/index",
        type: "menu",
        icon: "Server",
        visible: true,
        status: "active",
        perms: "monitor:server:list",
        sort: 2,
        createdAt: "2024-01-15"
      }
    ]
  },
  {
    id: "15",
    name: "系统工具",
    type: "directory",
    icon: "Wrench",
    visible: true,
    status: "active",
    sort: 3,
    createdAt: "2024-01-15",
    children: [
      {
        id: "16",
        name: "通知公告",
        parentId: "15",
        path: "/tool/notice",
        component: "tool/notice/index",
        type: "menu",
        icon: "Bell",
        visible: true,
        status: "active",
        perms: "tool:notice:list",
        sort: 1,
        createdAt: "2024-01-15"
      },
      {
        id: "17",
        name: "日志管理",
        parentId: "15",
        path: "/tool/log",
        component: "tool/log/index",
        type: "menu",
        icon: "FileText",
        visible: true,
        status: "active",
        perms: "tool:log:list",
        sort: 2,
        createdAt: "2024-01-15"
      }
    ]
  }
];

export default function MenuPage() {
  const [menus, setMenus] = useState<MenuItem[]>(mockMenus);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [menuToDelete, setMenuToDelete] = useState<MenuItem | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["1", "8", "15"]));
  const [formData, setFormData] = useState({
    name: "",
    parentId: "",
    path: "",
    component: "",
    icon: "",
    type: "menu" as "directory" | "menu" | "button",
    visible: true,
    status: "active" as "active" | "inactive",
    perms: "",
    sort: 1,
    remark: ""
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // 重置表单
  const resetForm = () => {
    setFormData({
      name: "",
      parentId: "",
      path: "",
      component: "",
      icon: "",
      type: "menu" as "directory" | "menu" | "button",
      visible: true,
      status: "active" as "active" | "inactive",
      perms: "",
      sort: 1,
      remark: ""
    });
    setFormErrors({});
    setEditingMenu(null);
    setIsSubmitting(false);
    setIsDirty(false);
  };

  // 更新统计信息
  const updateStats = () => {
    // 这里可以添加统计信息更新逻辑
    console.log("Stats updated");
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // 菜单名称验证
    if (!formData.name.trim()) {
      errors.name = "菜单名称不能为空";
    } else if (formData.name.length > 50) {
      errors.name = "菜单名称不能超过50个字符";
    }

    // 路由地址验证（目录和菜单需要）
    if (formData.type !== "button") {
      if (!formData.path.trim()) {
        errors.path = "路由地址不能为空";
      } else if (!formData.path.startsWith("/")) {
        errors.path = "路由地址必须以/开头";
      } else if (!/^[a-zA-Z0-9/_-]+$/.test(formData.path)) {
        errors.path = "路由地址只能包含字母、数字、下划线、连字符和斜杠";
      }
    }

    // 组件路径验证（菜单需要）
    if (formData.type === "menu") {
      if (!formData.component.trim()) {
        errors.component = "组件路径不能为空";
      } else if (!/^[a-zA-Z0-9/_-]+$/.test(formData.component)) {
        errors.component = "组件路径只能包含字母、数字、下划线、连字符和斜杠";
      }
    }

    // 权限标识验证（按钮需要）
    if (formData.type === "button") {
      if (!formData.perms.trim()) {
        errors.perms = "权限标识不能为空";
      } else if (!/^[a-zA-Z0-9:_-]+$/.test(formData.perms)) {
        errors.perms = "权限标识只能包含字母、数字、冒号、下划线和连字符";
      }
    }

    // 显示排序验证
    if (formData.sort < 0 || formData.sort > 9999) {
      errors.sort = "显示排序必须在0-9999之间";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const flattenMenus = (menuList: MenuItem[]): MenuItem[] => {
    const result: MenuItem[] = [];
    const traverse = (items: MenuItem[]) => {
      items.forEach(item => {
        result.push(item);
        if (item.children) {
          traverse(item.children);
        }
      });
    };
    traverse(menuList);
    return result;
  };

  const filteredMenus = flattenMenus(menus).filter(menu =>
    menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (menu.path && menu.path.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (menu.perms && menu.perms.toLowerCase().includes(searchTerm.toLowerCase()))
  );



  const expandAll = () => {
    const allIds = new Set<string>();
    const traverse = (items: MenuItem[]) => {
      items.forEach(item => {
        if (item.children && item.children.length > 0) {
          allIds.add(item.id);
        }
        if (item.children) {
          traverse(item.children);
        }
      });
    };
    traverse(menus);
    setExpandedNodes(allIds);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  const handleAdd = (parentId?: string) => {
    resetForm();
    setFormData(prev => ({
      ...prev,
      parentId: parentId || "",
      type: "menu"
    }));
    setIsDialogOpen(true);
  };

  const handleEdit = (menu: MenuItem) => {
    setFormData({
      name: menu.name,
      parentId: menu.parentId || "",
      path: menu.path || "",
      component: menu.component || "",
      icon: menu.icon || "",
      type: menu.type,
      visible: menu.visible,
      status: menu.status,
      perms: menu.perms || "",
      sort: menu.sort,
      remark: menu.remark || ""
    });
    setEditingMenu(menu);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (menu: MenuItem) => {
    setMenuToDelete(menu);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!menuToDelete) return;

    const deleteFromTree = (menuList: MenuItem[]): MenuItem[] => {
      return menuList.filter(menu => {
        if (menu.id === menuToDelete.id) {
          return false;
        }
        if (menu.children) {
          menu.children = deleteFromTree(menu.children);
        }
        return true;
      });
    };

    setMenus(deleteFromTree(menus));
    toast.success("菜单删除成功");
    setIsDeleteDialogOpen(false);
    setMenuToDelete(null);
    updateStats();
  };

  const toggleExpanded = (menuId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(menuId)) {
      newExpanded.delete(menuId);
    } else {
      newExpanded.add(menuId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderMenuRow = (menu: MenuItem, level: number = 0) => {
    const hasChildren = menu.children && menu.children.length > 0;
    const isExpanded = expandedNodes.has(menu.id);
    
    return (
      <React.Fragment key={menu.id}>
        <TableRow className="hover:bg-gray-50/50 transition-colors">
          <TableCell className="font-medium">
            <div className="flex items-center" style={{ paddingLeft: `${level * 24}px` }}>
              {hasChildren ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 mr-2 hover:bg-gray-200"
                  onClick={() => toggleExpanded(menu.id)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                  )}
                </Button>
              ) : (
                <div className="w-6 mr-2 flex justify-center">
                  <div className="w-px h-4 bg-gray-300"></div>
                </div>
              )}
              
              {/* 菜单图标 */}
              <div className="mr-2">
                {menu.type === "directory" && <Folder className="h-4 w-4 text-blue-500" />}
                {menu.type === "menu" && <FileText className="h-4 w-4 text-green-500" />}
                {menu.type === "button" && <Link className="h-4 w-4 text-orange-500" />}
              </div>
              
              {/* 菜单名称 */}
              <span className="font-medium text-gray-900">{menu.name}</span>
              
              {/* 菜单类型标签 */}
              <Badge 
                variant={menu.type === "directory" ? "default" : menu.type === "menu" ? "secondary" : "outline"}
                className="ml-2 text-xs"
              >
                {menu.type === "directory" ? "目录" : menu.type === "menu" ? "菜单" : "按钮"}
              </Badge>
            </div>
          </TableCell>
          
          <TableCell>
            <div className="flex items-center space-x-1">
              {menu.type === "directory" && <Folder className="h-4 w-4 text-blue-500" />}
              {menu.type === "menu" && <FileText className="h-4 w-4 text-green-500" />}
              {menu.type === "button" && <Link className="h-4 w-4 text-orange-500" />}
              <span className="text-sm">
                {menu.type === "directory" ? "目录" : menu.type === "menu" ? "菜单" : "按钮"}
              </span>
            </div>
          </TableCell>
          
          <TableCell>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
              {menu.path || "-"}
            </code>
          </TableCell>
          
          <TableCell>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
              {menu.perms || "-"}
            </code>
          </TableCell>
          
          <TableCell className="text-center">
            <Badge variant="outline" className="text-xs">
              {menu.sort}
            </Badge>
          </TableCell>
          
          <TableCell className="text-center">
            {menu.visible ? (
              <Eye className="h-4 w-4 text-green-500 mx-auto" />
            ) : (
              <EyeOff className="h-4 w-4 text-gray-400 mx-auto" />
            )}
          </TableCell>
          
          <TableCell className="text-center">
            <Badge variant={menu.status === "active" ? "default" : "secondary"}>
              {menu.status === "active" ? "正常" : "停用"}
            </Badge>
          </TableCell>
          
          <TableCell>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(menu)}
                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
              >
                <Edit className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAdd(menu.id)}
                className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                title="添加子菜单"
              >
                <Plus className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteClick(menu)}
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                disabled={hasChildren}
                title={hasChildren ? "请先删除子菜单" : "删除菜单"}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>操作</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleEdit(menu)}>
                    <Edit className="mr-2 h-4 w-4" />
                    编辑
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAdd(menu.id)}>
                    <Plus className="mr-2 h-4 w-4" />
                    添加子菜单
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleDeleteClick(menu)}
                    className="text-red-600"
                    disabled={hasChildren}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    删除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TableCell>
        </TableRow>
        
        {/* 递归渲染子菜单 */}
        {hasChildren && isExpanded && menu.children?.map(child => 
          renderMenuRow(child, level + 1)
        )}
      </React.Fragment>
    );
  };



  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("请检查表单输入");
      return;
    }

    setIsSubmitting(true);

    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingMenu) {
        // 更新菜单
        const updateMenuInTree = (items: MenuItem[]): MenuItem[] => {
          return items.map(item => {
            if (item.id === editingMenu.id) {
              return {
                ...item,
                ...formData,
                id: editingMenu.id,
                createdAt: item.createdAt
              };
            }
            if (item.children) {
              return {
                ...item,
                children: updateMenuInTree(item.children)
              };
            }
            return item;
          });
        };
        
        setMenus(updateMenuInTree(menus));
        toast.success("菜单更新成功！");
      } else {
        // 添加新菜单
        const newMenu: MenuItem = {
          ...formData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString().split('T')[0]
        };
        
        if (formData.parentId) {
          // 添加到指定父菜单下
          const addToParent = (items: MenuItem[]): MenuItem[] => {
            return items.map(item => {
              if (item.id === formData.parentId) {
                return {
                  ...item,
                  children: [...(item.children || []), newMenu]
                };
              }
              if (item.children) {
                return {
                  ...item,
                  children: addToParent(item.children)
                };
              }
              return item;
            });
          };
          setMenus(addToParent(menus));
        } else {
          // 添加为顶级菜单
          setMenus([...menus, newMenu]);
        }
        
        toast.success("菜单添加成功！");
      }
      
      setIsDialogOpen(false);
      setEditingMenu(null);
      resetForm();
      updateStats();
    } catch (error) {
      toast.error(editingMenu ? "菜单更新失败！" : "菜单添加失败！");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getParentMenuOptions = (menuList: MenuItem[], excludeId?: string) => {
    const options: Array<{ value: string; label: string; level: number }> = [];
    
    const traverse = (items: MenuItem[], level: number = 0) => {
      items.forEach(menu => {
        if (menu.type !== "button" && (!excludeId || menu.id !== excludeId)) {
          options.push({
            value: menu.id,
            label: menu.name,
            level
          });
          if (menu.children) {
            traverse(menu.children, level + 1);
          }
        }
      });
    };
    
    traverse(menuList);
    return options;
  };

  // 统计信息
  const stats = {
    total: flattenMenus(menus).length,
    directories: flattenMenus(menus).filter(m => m.type === "directory").length,
    menus: flattenMenus(menus).filter(m => m.type === "menu").length,
    buttons: flattenMenus(menus).filter(m => m.type === "button").length,
    hidden: flattenMenus(menus).filter(m => !m.visible).length
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* 页面标题和统计 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">菜单管理</h1>
            <p className="text-muted-foreground">
              管理系统菜单结构和权限配置
            </p>
          </div>
          <Button onClick={(e) => { e.preventDefault(); handleAdd(); }} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            新增菜单
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">菜单总数</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Menu className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">顶级菜单</p>
                  <p className="text-2xl font-bold">{stats.directories}</p>
                </div>
                <Folder className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">页面菜单</p>
                  <p className="text-2xl font-bold">{stats.menus}</p>
                </div>
                <FileText className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">按钮权限</p>
                  <p className="text-2xl font-bold">{stats.buttons}</p>
                </div>
                <Link className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">隐藏菜单</p>
                  <p className="text-2xl font-bold">{stats.hidden}</p>
                </div>
                <EyeOff className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 搜索和操作 */}
        <Card>
          <CardHeader>
            <CardTitle>搜索筛选</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="搜索菜单名称、路径、权限标识..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={expandAll}>
                  <Maximize2 className="h-4 w-4 mr-2" />
                  展开全部
                </Button>
                <Button variant="outline" size="sm" onClick={collapseAll}>
                  <Minimize2 className="h-4 w-4 mr-2" />
                  收起全部
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 菜单列表 */}
        <Card>
          <CardHeader>
            <CardTitle>菜单列表</CardTitle>
            <CardDescription>
              系统菜单树形结构，支持拖拽排序和层级管理
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>菜单名称</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>路径</TableHead>
                  <TableHead>权限标识</TableHead>
                  <TableHead>可见</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-center">排序</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchTerm ? (
                  filteredMenus.map(menu => (
                    <TableRow key={menu.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {menu.type === "directory" && <Folder className="w-4 h-4 mr-2 text-blue-500" />}
                          {menu.type === "menu" && <FileText className="w-4 h-4 mr-2 text-green-500" />}
                          {menu.type === "button" && <Link className="w-4 h-4 mr-2 text-orange-500" />}
                          <span className="font-medium">{menu.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={menu.type === "directory" ? "secondary" : menu.type === "menu" ? "default" : "outline"}>
                          {menu.type === "directory" ? "目录" : menu.type === "menu" ? "菜单" : "按钮"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-1 py-0.5 rounded">
                          {menu.path || "-"}
                        </code>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-1 py-0.5 rounded">
                          {menu.perms || "-"}
                        </code>
                      </TableCell>
                      <TableCell>
                        {menu.visible ? (
                          <Eye className="w-4 h-4 text-green-500" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={menu.status === "active" ? "default" : "secondary"}>
                          {menu.status === "active" ? "正常" : "停用"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{menu.sort}</TableCell>
                      <TableCell className="text-muted-foreground">{menu.createdAt}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleEdit(menu)}>
                              <Edit className="mr-2 h-4 w-4" />
                              编辑
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(menu)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  menus.map(menu => renderMenuRow(menu))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 菜单表单对话框 */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingMenu ? "编辑菜单" : "新增菜单"}</DialogTitle>
              <DialogDescription>
                {editingMenu ? "修改菜单信息和权限配置" : "添加新的菜单项到系统中"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    菜单名称 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="请输入菜单名称"
                    maxLength={50}
                    className={formErrors.name ? "border-red-500" : ""}
                  />
                  <div className="flex justify-between items-center">
                    {formErrors.name && (
                      <p className="text-sm text-red-500">{formErrors.name}</p>
                    )}
                    <div className="text-xs text-gray-500 ml-auto">
                      {formData.name.length}/50
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm font-medium">
                    菜单类型 <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.type} onValueChange={(value) => {
                    setFormData({
                      ...formData, 
                      type: value as "directory" | "menu" | "button",
                      // 重置相关字段
                      path: value === "button" ? "" : formData.path,
                      component: value === "button" ? "" : formData.component,
                      perms: value !== "button" ? "" : formData.perms
                    });
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择菜单类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="directory">
                        <div className="flex items-center">
                          <Folder className="h-4 w-4 mr-2" />
                          目录
                        </div>
                      </SelectItem>
                      <SelectItem value="menu">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          菜单
                        </div>
                      </SelectItem>
                      <SelectItem value="button">
                        <div className="flex items-center">
                          <Link className="h-4 w-4 mr-2" />
                          按钮
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parentId">上级菜单</Label>
                  <Select value={formData.parentId || "root"} onValueChange={(value) => setFormData({ ...formData, parentId: value === "root" ? "" : value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择上级菜单" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="root">无上级菜单</SelectItem>
                      {getParentMenuOptions(menus, editingMenu?.id).map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sort">显示排序 *</Label>
                  <Input
                    id="sort"
                    type="number"
                    min="0"
                    value={formData.sort}
                    onChange={(e) => setFormData({ ...formData, sort: parseInt(e.target.value) || 0 })}
                    className={formErrors.sort ? "border-red-500" : ""}
                  />
                  {formErrors.sort && (
                    <p className="text-sm text-red-500">{formErrors.sort}</p>
                  )}
                </div>
              </div>

              {formData.type !== "button" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="path" className="text-sm font-medium">
                      路由地址 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="path"
                      value={formData.path}
                      onChange={(e) => setFormData({...formData, path: e.target.value})}
                      placeholder="请输入路由地址，如：/system/user"
                      className={formErrors.path ? "border-red-500" : ""}
                    />
                    {formErrors.path && (
                      <p className="text-sm text-red-500">{formErrors.path}</p>
                    )}
                    <div className="text-xs text-gray-500">
                      路由地址应以/开头，只能包含字母、数字、下划线和连字符
                    </div>
                  </div>

                  {(formData.type === "menu" || formData.type === "directory") && (
                    <div className="space-y-2">
                      <Label htmlFor="component" className="text-sm font-medium">
                        组件路径 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="component"
                        value={formData.component}
                        onChange={(e) => setFormData({...formData, component: e.target.value})}
                        placeholder="请输入组件路径，如：system/user/index"
                        className={formErrors.component ? "border-red-500" : ""}
                      />
                      {formErrors.component && (
                        <p className="text-sm text-red-500">{formErrors.component}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {formData.type === "button" && (
                <div className="space-y-2">
                  <Label htmlFor="perms" className="text-sm font-medium">
                    权限标识 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="perms"
                    value={formData.perms}
                    onChange={(e) => setFormData({...formData, perms: e.target.value})}
                    placeholder="请输入权限标识，如：system:user:add"
                    className={formErrors.perms ? "border-red-500" : ""}
                  />
                  {formErrors.perms && (
                    <p className="text-sm text-red-500">{formErrors.perms}</p>
                  )}
                  <div className="text-xs text-gray-500">
                    权限标识格式：模块:功能:操作，只能包含字母、数字、冒号、下划线和连字符
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="icon" className="text-sm font-medium">菜单图标</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  placeholder="请输入图标名称"
                />
                <div className="text-xs text-gray-500">
                  支持 Lucide React 图标
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">显示状态</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.visible}
                      onCheckedChange={(checked) => setFormData({...formData, visible: checked})}
                    />
                    <span className="text-sm text-gray-600">
                      {formData.visible ? "显示" : "隐藏"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    控制菜单是否在导航中显示
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">菜单状态</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.status === "active"}
                      onCheckedChange={(checked) => setFormData({...formData, status: checked ? "active" : "inactive"})}
                    />
                    <span className="text-sm text-gray-600">
                      {formData.status === "active" ? "正常" : "停用"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    停用后菜单将无法访问
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="remark" className="text-sm font-medium">备注</Label>
                <Textarea
                  id="remark"
                  value={formData.remark}
                  onChange={(e) => setFormData({...formData, remark: e.target.value})}
                  placeholder="请输入备注信息"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                取消
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "处理中..." : (editingMenu ? "更新" : "添加")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 删除确认对话框 */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                确认删除
              </AlertDialogTitle>
              <AlertDialogDescription>
                您确定要删除菜单 <span className="font-semibold">&ldquo;{menuToDelete?.name}&rdquo;</span> 吗？
                {menuToDelete?.children && menuToDelete.children.length > 0 && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700">
                    <p className="text-sm">⚠️ 该菜单下存在 {menuToDelete.children.length} 个子菜单，请先删除子菜单。</p>
                  </div>
                )}
                <br />
                此操作不可撤销，请谨慎操作。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
                disabled={menuToDelete?.children && menuToDelete.children.length > 0}
              >
                确认删除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}