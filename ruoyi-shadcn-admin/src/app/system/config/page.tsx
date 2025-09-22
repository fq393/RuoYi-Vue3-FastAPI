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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Settings,
  Filter,
  RefreshCw,
  Database,
  Shield,
  Eye,
  EyeOff,
  Building
} from "lucide-react";
import { toast } from "sonner";

interface Config {
  id: string;
  name: string;
  key: string;
  value: string;
  type: "Y" | "N";
  category: 'system' | 'business' | 'security';
  status: 'enabled' | 'disabled';
  remark?: string;
  createdAt: string;
  updatedAt: string;
}

const mockConfigs: Config[] = [
  {
    id: "1",
    name: "主框架页-默认皮肤样式名称",
    key: "sys.index.skinName",
    value: "skin-blue",
    type: "Y",
    category: 'system',
    status: 'enabled',
    remark: "蓝色 skin-blue、绿色 skin-green、紫色 skin-purple、红色 skin-red、黄色 skin-yellow",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20"
  },
  {
    id: "2",
    name: "用户管理-账号初始密码",
    key: "sys.user.initPassword",
    value: "123456",
    type: "Y",
    category: 'security',
    status: 'enabled',
    remark: "初始化密码 123456",
    createdAt: "2024-01-16",
    updatedAt: "2024-01-18"
  },
  {
    id: "3",
    name: "主框架页-侧边栏主题",
    key: "sys.index.sideTheme",
    value: "theme-dark",
    type: "Y",
    category: 'system',
    status: 'enabled',
    remark: "深色主题theme-dark，浅色主题theme-light",
    createdAt: "2024-01-17",
    updatedAt: "2024-01-19"
  },
  {
    id: "4",
    name: "账号自助-验证码开关",
    key: "sys.account.captchaEnabled",
    value: "true",
    type: "Y",
    category: 'security',
    status: 'enabled',
    remark: "是否开启验证码功能（true开启，false关闭）",
    createdAt: "2024-01-18",
    updatedAt: "2024-01-20"
  },
  {
    id: "5",
    name: "账号自助-是否开启用户注册功能",
    key: "sys.account.registerUser",
    value: "false",
    type: "Y",
    category: 'business',
    status: 'disabled',
    remark: "是否开启注册用户功能（true开启，false关闭）",
    createdAt: "2024-01-19",
    updatedAt: "2024-01-20"
  },
  {
    id: "6",
    name: "用户登录-黑名单列表",
    key: "sys.login.blackIPList",
    value: "",
    type: "Y",
    category: 'security',
    status: 'enabled',
    remark: "设置登录IP黑名单限制，多个匹配项以;分隔，支持匹配（*通配、网段）",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20"
  }
];

export default function ConfigPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [configs, setConfigs] = useState<Config[]>(mockConfigs);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<Config | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    value: '',
    type: 'Y' as Config['type'],
    category: 'system' as Config['category'],
    status: 'enabled' as Config['status'],
    remark: ''
  });

  // 筛选配置
  const filteredConfigs = configs.filter(config => {
    const matchesSearch = config.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         config.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         config.value.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || config.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || config.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // 统计数据
  const totalConfigs = configs.length;
  const systemConfigs = configs.filter(c => c.category === 'system').length;
  const businessConfigs = configs.filter(c => c.category === 'business').length;
  const securityConfigs = configs.filter(c => c.category === 'security').length;
  const enabledConfigs = configs.filter(c => c.status === 'enabled').length;

  // 处理新增
  const handleAdd = () => {
    setEditingConfig(null);
    setFormData({
      name: '',
      key: '',
      value: '',
      type: 'Y',
      category: 'system',
      status: 'enabled',
      remark: ''
    });
    setIsDialogOpen(true);
  };

  // 处理编辑
  const handleEdit = (config: Config) => {
    setEditingConfig(config);
    setFormData({
      name: config.name,
      key: config.key,
      value: config.value,
      type: config.type,
      category: config.category,
      status: config.status,
      remark: config.remark || ''
    });
    setIsDialogOpen(true);
  };

  // 处理删除
  const handleDelete = (config: Config) => {
    if (confirm('确定要删除这个参数配置吗？')) {
      setConfigs(configs.filter(c => c.id !== config.id));
      toast.success(`已删除参数: ${config.name}`);
    }
  };

  // 处理状态切换
  const handleToggleStatus = (config: Config) => {
    const newStatus = config.status === 'enabled' ? 'disabled' : 'enabled';
    setConfigs(configs.map(c => 
      c.id === config.id 
        ? { ...c, status: newStatus, updatedAt: new Date().toLocaleString('zh-CN') }
        : c
    ));
    toast.success(`已${newStatus === 'enabled' ? '启用' : '停用'}参数: ${config.name}`);
  };

  // 处理表单提交
  const handleSubmit = () => {
    if (!formData.name || !formData.key || !formData.value) {
      toast.error('请填写必填字段');
      return;
    }

    const now = new Date().toLocaleString('zh-CN');
    
    if (editingConfig) {
      // 更新
      setConfigs(configs.map(config => 
        config.id === editingConfig.id 
          ? { ...config, ...formData, updatedAt: now }
          : config
      ));
      toast.success(`已更新参数: ${formData.name}`);
    } else {
      // 新增
      const newConfig: Config = {
        id: (Math.max(...configs.map(c => parseInt(c.id))) + 1).toString(),
        ...formData,
        createdAt: now,
        updatedAt: now
      };
      setConfigs([...configs, newConfig]);
      toast.success(`已添加参数: ${formData.name}`);
    }
    
    setIsDialogOpen(false);
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 刷新配置
  const handleRefresh = () => {
    setConfigs([...mockConfigs]);
    toast.success("已刷新配置缓存");
  };

  const handleFilter = () => {
    toast.info("筛选参数功能待实现");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">参数设置</h1>
            <p className="text-muted-foreground">
              管理系统参数配置
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleRefresh} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              刷新缓存
            </Button>
            <Button onClick={handleAdd} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              新增参数
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总参数</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalConfigs}</div>
              <p className="text-xs text-muted-foreground">
                系统配置参数总数
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">系统配置</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemConfigs}</div>
              <p className="text-xs text-muted-foreground">
                系统核心配置
              </p>
            </CardContent>
          </Card>
          <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">业务配置</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businessConfigs}</div>
            <p className="text-xs text-muted-foreground">
              业务相关配置
            </p>
          </CardContent>
        </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">安全配置</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{securityConfigs}</div>
              <p className="text-xs text-muted-foreground">
                安全相关配置
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">启用配置</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enabledConfigs}</div>
              <p className="text-xs text-muted-foreground">
                当前启用的配置
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 搜索和筛选 */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索参数名称、键名或值..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="分类" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部分类</SelectItem>
                    <SelectItem value="system">系统配置</SelectItem>
                    <SelectItem value="business">业务配置</SelectItem>
                    <SelectItem value="security">安全配置</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="enabled">启用</SelectItem>
                    <SelectItem value="disabled">停用</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleRefresh}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  刷新缓存
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 参数列表 */}
        <Card>
          <CardHeader>
            <CardTitle>参数列表</CardTitle>
            <p className="text-sm text-muted-foreground">
              共 {filteredConfigs.length} 条记录
            </p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>参数名称</TableHead>
                  <TableHead>参数键名</TableHead>
                  <TableHead>参数键值</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead>系统内置</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>更新时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConfigs.map((config) => (
                  <TableRow key={config.id}>
                    <TableCell className="font-medium">{config.name}</TableCell>
                    <TableCell>
                      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                        {config.key}
                      </code>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate" title={config.value}>
                      {config.value}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {config.category === 'system' ? '系统配置' : 
                         config.category === 'business' ? '业务配置' : '安全配置'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={config.type === 'Y' ? 'default' : 'secondary'}>
                        {config.type === 'Y' ? '是' : '否'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant={config.status === 'enabled' ? 'default' : 'secondary'}>
                          {config.status === 'enabled' ? '启用' : '停用'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(config)}
                          className="h-6 w-6 p-0"
                        >
                          {config.status === 'enabled' ? 
                            <EyeOff className="h-3 w-3" /> : 
                            <Eye className="h-3 w-3" />
                          }
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {config.updatedAt}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(config)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(config)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 新增/编辑对话框 */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingConfig ? '编辑参数' : '新增参数'}
              </DialogTitle>
              <DialogDescription>
                {editingConfig ? '修改参数配置信息' : '添加新的参数配置'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">参数名称 *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="请输入参数名称"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="key">参数键名 *</Label>
                  <Input
                    id="key"
                    name="key"
                    value={formData.key}
                    onChange={handleInputChange}
                    placeholder="请输入参数键名"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">参数键值 *</Label>
                <Input
                  id="value"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  placeholder="请输入参数键值"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">分类</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as Config['category'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">系统配置</SelectItem>
                      <SelectItem value="business">业务配置</SelectItem>
                      <SelectItem value="security">安全配置</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">系统内置</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as Config['type'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">是</SelectItem>
                      <SelectItem value="N">否</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">状态</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Config['status'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">启用</SelectItem>
                      <SelectItem value="disabled">停用</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="remark">备注</Label>
                <Textarea
                  id="remark"
                  name="remark"
                  value={formData.remark}
                  onChange={handleInputChange}
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
                {editingConfig ? '更新' : '添加'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}