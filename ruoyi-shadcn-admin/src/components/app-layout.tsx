"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import {
  Bell,
  ChevronRight,
  ChevronsUpDown,
  Command,
  CreditCard,
  Folder,
  GalleryVerticalEnd,
  LogOut,
  Settings2,
  Sparkles,
  User,
  Users,
  Shield,
  Database,
  Monitor,
  Wrench,
  Home,
  Menu,
  Building2,
  FileText,
  Settings,
  Server,
  Code,
  Activity,
  Globe,
} from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

// 菜单数据结构
const data = {
  user: {
    name: "管理员",
    email: "admin@ruoyi.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "RuoYi 管理系统",
      logo: GalleryVerticalEnd,
      plan: "企业版",
    },
  ],
  navMain: [
    {
      title: "首页",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "系统管理",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "用户管理",
          url: "/system/users",
          icon: Users,
        },
        {
          title: "角色管理",
          url: "/system/roles",
          icon: Shield,
        },
        {
          title: "菜单管理",
          url: "/system/menus",
          icon: Menu,
        },
        {
          title: "部门管理",
          url: "/system/dept",
          icon: Building2,
        },
        {
          title: "岗位管理",
          url: "/system/post",
          icon: CreditCard,
        },
        {
          title: "字典管理",
          url: "/system/dict",
          icon: Database,
        },
        {
          title: "参数设置",
          url: "/system/config",
          icon: Settings,
        },
        {
          title: "通知公告",
          url: "/system/notice",
          icon: Bell,
        },
        {
          title: "日志管理",
          url: "/system/log",
          icon: FileText,
        },
      ],
    },
    {
      title: "系统监控",
      url: "#",
      icon: Monitor,
      items: [
        {
          title: "在线用户",
          url: "/monitor/online",
          icon: Users,
        },
        {
          title: "服务器监控",
          url: "/monitor/server",
          icon: Server,
        },
        {
          title: "操作日志",
          url: "/monitor/logs",
          icon: Activity,
        },
      ],
    },
    {
      title: "系统工具",
      url: "#",
      icon: Wrench,
      items: [
        {
          title: "代码生成",
          url: "/tools/generator",
          icon: Code,
        },
        {
          title: "系统接口",
          url: "/tools/system",
          icon: Globe,
        },
      ],
    },
  ],
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [activeTeam, setActiveTeam] = React.useState(data.teams[0])
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // 根据当前路径找到应该展开的菜单
  const getActiveMenuFromPath = React.useCallback((currentPath: string) => {
    const activeMenus: Record<string, boolean> = {}
    
    data.navMain.forEach(item => {
      if (item.items) {
        // 检查是否有子菜单项匹配当前路径
        const hasActiveChild = item.items.some(subItem => currentPath.startsWith(subItem.url))
        activeMenus[item.title] = hasActiveChild
      }
    })
    
    return activeMenus
  }, [])

  // 管理菜单展开状态
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>(() => {
    return getActiveMenuFromPath(pathname)
  })

  // 监听路由变化，更新菜单展开状态
  React.useEffect(() => {
    const activeMenus = getActiveMenuFromPath(pathname)
    setOpenMenus(prev => ({
      ...prev,
      ...activeMenus
    }))
  }, [pathname, getActiveMenuFromPath])

  // 切换菜单展开状态
  const toggleMenu = (menuTitle: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuTitle]: !prev[menuTitle]
    }))
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
      toast.success('退出登录成功')
    } catch {
      toast.error('退出登录失败')
    }
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <activeTeam.logo className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {activeTeam.name}
                      </span>
                      <span className="truncate text-xs">{activeTeam.plan}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    系统
                  </DropdownMenuLabel>
                  {data.teams.map((team) => (
                    <DropdownMenuItem
                      key={team.name}
                      onClick={() => setActiveTeam(team)}
                      className="gap-2 p-2"
                    >
                      <div className="flex size-6 items-center justify-center rounded-sm border">
                        <team.logo className="size-4 shrink-0" />
                      </div>
                      {team.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>导航菜单</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  open={openMenus[item.title] || false}
                  onOpenChange={() => toggleMenu(item.title)}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    {item.items ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <Link href={subItem.url}>
                                    {subItem.icon && <subItem.icon className="size-4" />}
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : (
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <Link href={item.url}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                       <AvatarImage src={user?.avatar || data.user.avatar} alt={user?.username || data.user.name} />
                       <AvatarFallback className="rounded-lg">{user?.username?.charAt(0) || "管"}</AvatarFallback>
                     </Avatar>
                     <div className="grid flex-1 text-left text-sm leading-tight">
                       <span className="truncate font-semibold">{user?.username || data.user.name}</span>
                       <span className="truncate text-xs">{user?.email || data.user.email}</span>
                     </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                       <Avatar className="h-8 w-8 rounded-lg">
                         <AvatarImage src={user?.avatar || data.user.avatar} alt={user?.username || data.user.name} />
                         <AvatarFallback className="rounded-lg">{user?.username?.charAt(0) || "管"}</AvatarFallback>
                       </Avatar>
                       <div className="grid flex-1 text-left text-sm leading-tight">
                         <span className="truncate font-semibold">{user?.username || data.user.name}</span>
                         <span className="truncate text-xs">{user?.email || data.user.email}</span>
                       </div>
                     </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Sparkles />
                      升级到专业版
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User />
                        个人中心
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard />
                      账单
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings2 />
                        设置
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link href="/dashboard">
                      首页
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>仪表板</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-4">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}