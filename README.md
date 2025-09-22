<p align="center">
	<img alt="logo" src="https://oscimg.oschina.net/oscnet/up-d3d0a9303e11d522a06cd263f3079027715.png">
</p>
<h1 align="center" style="margin: 30px 0 30px; font-weight: bold;">RuoYi-Vue3-FastAPI v1.7.0</h1>
<h4 align="center">基于RuoYi-Vue3+FastAPI前后端分离的快速开发框架</h4>
<p align="center">
	<a href="https://gitee.com/insistence2022/RuoYi-Vue3-FastAPI/stargazers"><img src="https://gitee.com/insistence2022/RuoYi-Vue3-FastAPI/badge/star.svg?theme=dark"></a>
    <a href="https://github.com/insistence/RuoYi-Vue3-FastAPI"><img src="https://img.shields.io/github/stars/insistence/RuoYi-Vue3-FastAPI?style=social"></a>
	<a href="https://gitee.com/insistence2022/RuoYi-Vue3-FastAPI"><img src="https://img.shields.io/badge/RuoYiVue3FastAPI-v1.7.0-brightgreen.svg"></a>
	<a href="https://gitee.com/insistence2022/RuoYi-Vue3-FastAPI/blob/master/LICENSE"><img src="https://img.shields.io/github/license/mashape/apistatus.svg"></a>
    <img src="https://img.shields.io/badge/node-≥18-blue">
    <img src="https://img.shields.io/badge/python-≥3.9-blue">
    <img src="https://img.shields.io/badge/MySQL-≥5.7-blue">
</p>

## 平台简介

RuoYi-Vue3-FastAPI是一套全部开源的快速开发平台，毫无保留给个人及企业免费使用。

* 前端采用Vue3、Element Plus，基于<u>[RuoYi-Vue3](https://github.com/yangzongzhuan/RuoYi-Vue3)</u>前端项目修改。
* 后端采用FastAPI、sqlalchemy、MySQL（PostgreSQL）、Redis、OAuth2 & Jwt。
* 权限认证使用OAuth2 & Jwt，支持多终端认证系统。
* 支持加载动态权限菜单，多方式轻松权限控制。
* **🎨 已完成黑色主题改造**：参考[即梦AI](https://jimeng.jianying.com/ai-tool/home)设计风格，实现了现代化的深色主题界面。

## 🌙 黑色主题特性

本项目已完成全面的黑色主题改造，具备以下特性：

### 设计风格
- **现代化深色界面**：采用深色主题设计，减少视觉疲劳，提升夜间使用体验
- **渐变色彩搭配**：使用紫蓝色渐变，营造科技感和现代感
- **玻璃拟态效果**：运用毛玻璃效果和半透明设计，增强视觉层次

### 主题覆盖范围
- **全局样式系统**：统一的颜色变量和设计规范
- **导航栏改造**：深色背景配合渐变装饰，提升品牌识别度
- **侧边栏优化**：现代化菜单设计，支持展开收起动画
- **主内容区域**：深色卡片布局，优化内容展示效果
- **表单组件**：统一的深色主题表单样式

### 技术实现
- **CSS变量系统**：使用CSS自定义属性实现主题切换
- **响应式设计**：适配不同屏幕尺寸的设备
- **动画增强**：添加平滑过渡动画，提升交互体验
- **组件级优化**：深度定制Element Plus组件样式

## 🎨 界面优化特性

### 布局框架优化
- **色调完全统一**：导航栏、侧边栏采用统一的#0a0a0a深色背景，消除色差
- **圆角内容框架**：主内容区域采用16px圆角设计，半透明背景和微妙边框
- **玻璃拟态效果**：内容区域使用backdrop-filter模糊效果，增强视觉层次
- **精致边框设计**：添加微妙的分隔线，增强区域划分的视觉效果
- **流畅交互体验**：优化菜单项悬停效果，添加平滑的位移动画
- **自定义滚动条**：统一的滚动条样式，与整体主题保持一致
- **顶部导航优化**：去除面包屑导航，减少导航栏高度至 48px，优化空间利用
- **标签页主题统一**：标签页采用深色主题，活跃标签使用渐变背景，提升视觉一致性

### 登录页面重构
- **现代化设计**：全新的登录界面设计，符合当前设计趋势
- **简化粒子背景**：15个动态粒子营造科技感氛围，进一步优化性能和视觉效果
- **品牌展示区域**：突出系统Logo和品牌信息，采用渐变色设计
- **简洁登录体验**：移除第三方登录功能，专注核心登录流程
- **统一黑色主题**：登录页面完全采用#0a0a0a深色背景，与系统主题保持一致
- **玻璃拟态效果**：登录表单采用半透明背景和毛玻璃效果，增强视觉层次
- **验证码优化**：验证码图片集成到输入框内部右侧，提升用户体验和界面简洁性
- **精简设计语言**：减少视觉噪音，采用更加简洁大气的设计风格
- **响应式适配**：完美适配移动端和桌面端设备，优化不同屏幕尺寸的显示效果

### 交互体验提升
- **微动效设计**：按钮悬停、输入框聚焦等交互动画
- **视觉反馈**：表单验证、加载状态等用户反馈优化
- **无障碍设计**：考虑键盘导航和屏幕阅读器支持

### 权限控制优化
- **强制登录验证**：默认所有页面都需要登录才能访问，确保系统安全性
- **白名单机制**：仅登录、注册、404、401等必要页面允许匿名访问
- **路由守卫增强**：优化权限控制逻辑，简化配置流程
- **安全性提升**：移除不必要的公开访问页面，防止未授权访问
* Vue2版本：
  - Gitte仓库地址：https://gitee.com/insistence2022/RuoYi-Vue-FastAPI
  - GitHub仓库地址：https://github.com/insistence/RuoYi-Vue-FastAPI
* 纯Python版本：
  - Gitte仓库地址：https://gitee.com/insistence2022/dash-fastapi-admin
  - GitHub仓库地址：https://github.com/insistence/Dash-FastAPI-Admin
* 特别鸣谢：<u>[RuoYi-Vue3](https://github.com/yangzongzhuan/RuoYi-Vue3)</u>

## 内置功能

1.  用户管理：用户是系统操作者，该功能主要完成系统用户配置。
2.  角色管理：角色菜单权限分配、设置角色按机构进行数据范围权限划分。
3.  菜单管理：配置系统菜单，操作权限，按钮权限标识等。
4.  部门管理：配置系统组织机构（公司、部门、小组）。
5.  岗位管理：配置系统用户所属担任职务。
6.  字典管理：对系统中经常使用的一些较为固定的数据进行维护，支持字典类型和字典数据的完整CRUD操作，包含表单验证、批量操作等功能。
7.  参数管理：对系统动态配置常用参数。
8.  通知公告：系统通知公告信息发布维护。
9.  操作日志：系统正常操作日志记录和查询；系统异常信息日志记录和查询。
10. 登录日志：系统登录日志记录查询包含登录异常。
11. 在线用户：当前系统中活跃用户状态监控。
12. 定时任务：在线（添加、修改、删除）任务调度包含执行结果日志。
13. 服务监控：监视当前系统CPU、内存、磁盘、堆栈等相关信息。
14. 缓存监控：对系统的缓存信息查询，命令统计等。
15. 在线构建器：拖动表单元素生成相应的HTML代码。
16. 系统接口：根据业务代码自动生成相关的api接口文档。
17. 代码生成：配置数据库表信息一键生成前后端代码（python、sql、vue、js），支持下载。

## 功能完善记录

### 字典管理功能完善 (2024)

本次对字典管理功能进行了全面完善，主要包括：

#### 字典类型管理
- ✅ 完整的CRUD操作（新增、编辑、删除、查看）
- ✅ 表单验证和错误处理
- ✅ 搜索和筛选功能
- ✅ 响应式设计，支持移动端
- ✅ 删除确认对话框
- ✅ 状态管理和数据同步

#### 字典数据管理
- ✅ 独立的字典数据管理页面
- ✅ 按字典类型分类管理数据
- ✅ 支持字典数据的增删改查
- ✅ 数据排序和状态控制
- ✅ 批量操作支持
- ✅ 实时搜索和过滤

#### 技术特性
- 🎨 采用现代化的UI设计，基于shadcn/ui组件库
- 🌙 完美支持黑色主题
- 📱 响应式布局，适配各种屏幕尺寸
- ⚡ 优化的用户体验和交互流程
- 🔒 完善的表单验证和错误处理
- 🚀 高性能的数据加载和渲染

## 演示图

<table>
    <tr>
        <td><img src="https://gitee.com/insistence2022/RuoYi-Vue-FastAPI/raw/master/demo-pictures/login.png"/></td>
        <td><img src="https://gitee.com/insistence2022/RuoYi-Vue-FastAPI/raw/master/demo-pictures/dashboard.png"/></td>
    </tr>
    <tr>
        <td><img src="https://gitee.com/insistence2022/RuoYi-Vue-FastAPI/raw/master/demo-pictures/user.png"/></td>
        <td><img src="https://gitee.com/insistence2022/RuoYi-Vue-FastAPI/raw/master/demo-pictures/role.png"/></td>
    </tr>
    <tr>
        <td><img src="https://gitee.com/insistence2022/RuoYi-Vue-FastAPI/raw/master/demo-pictures/menu.png"/></td>
        <td><img src="https://gitee.com/insistence2022/RuoYi-Vue-FastAPI/raw/master/demo-pictures/dept.png"/></td>
    </tr>
    <tr>
        <td><img src="https://gitee.com/insistence2022/RuoYi-Vue-FastAPI/raw/master/demo-pictures/post.png"/></td>
        <td><img src="https://gitee.com/insistence2022/RuoYi-Vue-FastAPI/raw/master/demo-pictures/dict.png"/></td>
    </tr>	 
    <tr>
        <td><img src="https://gitee.com/insistence2022/RuoYi-Vue-FastAPI/raw/master/demo-pictures/config.png"/></td>
        <td><img src="https://gitee.com/insistence2022/RuoYi-Vue-FastAPI/raw/master/demo-pictures/notice.png"/></td>
    </tr>
    <tr>
        <td><img src="https://gitee.com/insistence2022/RuoYi-Vue-FastAPI/raw/master/demo-pictures/operLog.png"/></td>
        <td><img src="https://gitee.com/insistence2022/RuoYi-Vue-FastAPI/raw/master/demo-pictures/loginLog.png"/></td>
    </tr>
    <tr>
        <td><img src="https://gitee.com/insistence2022/RuoYi-Vue-FastAPI/raw/master/demo-pictures/online.png"/></td>
        <td><img src="https://gitee.com/insistence2022/RuoYi-Vue-FastAPI/raw/master/demo-pictures/job.png"/></td>
    </tr>
    <tr>
        <td><img src="https://gitee.com/insistence2022/RuoYi-Vue-FastAPI/raw/master/demo-pictures/server.png"/></td>
        <td><img src="https://gitee.com/insistence2022/RuoYi-Vue-FastAPI/raw/master/demo-pictures/cache.png"/></td>
    </tr>
    <tr>
        <td><img src="https://gitee.com/insistence2022/RuoYi-Vue-FastAPI/raw/master/demo-pictures/cacheList.png"></td>
        <td><img src="https://gitee.com/insistence2022/RuoYi-Vue-FastAPI/raw/master/demo-pictures/form.png"></td>
    </tr>
    <tr>
        <td><img src="https://gitee.com/insistence2022/RuoYi-Vue-FastAPI/raw/master/demo-pictures/api.png"></td>
        <td><img src="https://gitee.com/insistence2022/RuoYi-Vue-FastAPI/raw/master/demo-pictures/gen.png"/></td>
    </tr>
    <tr>
        <td><img src="https://gitee.com/insistence2022/RuoYi-Vue-FastAPI/raw/master/demo-pictures/profile.png"/></td>
    </tr>
</table>

## 在线体验
- *账号：admin*
- *密码：admin123*
- 演示地址：<a href="https://vfadmin.insistence.tech">vfadmin管理系统<a>

## 项目开发及发布相关

### 开发

```bash
# 克隆项目
git clone https://gitee.com/insistence2022/RuoYi-Vue3-FastAPI.git

# 进入项目根目录
cd RuoYi-Vue3-FastAPI
```

#### 前端
```bash
# 进入前端目录
cd ruoyi-fastapi-frontend

# 安装依赖
npm install 或 yarn --registry=https://registry.npmmirror.com

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npmmirror.com

# 启动服务
npm run dev 或 yarn dev
```

#### 后端
```bash
# 进入后端目录
cd ruoyi-fastapi-backend

# 如果使用的是MySQL数据库，请执行以下命令安装项目依赖环境
pip3 install -r requirements.txt
# 如果使用的是PostgreSQL数据库，请执行以下命令安装项目依赖环境
pip3 install -r requirements-pg.txt

# 配置环境
在.env.dev文件中配置开发环境的数据库和redis

# 运行sql文件
1.新建数据库ruoyi-fastapi(默认，可修改)
2.如果使用的是MySQL数据库，使用命令或数据库连接工具运行sql文件夹下的ruoyi-fastapi.sql；如果使用的是PostgreSQL数据库，使用命令或数据库连接工具运行sql文件夹下的ruoyi-fastapi-pg.sql

# 运行后端
python3 app.py --env=dev
```

#### 访问
```bash
# 默认账号密码
账号：admin
密码：admin123

# 浏览器访问
地址：http://localhost:80
```

### 发布

#### 前端
```bash
# 构建测试环境
npm run build:stage 或 yarn build:stage

# 构建生产环境
npm run build:prod 或 yarn build:prod
```

#### 后端
```bash
# 配置环境
在.env.prod文件中配置生产环境的数据库和redis

# 运行后端
python3 app.py --env=prod
```

## 交流与赞助
如果有对本项目及FastAPI感兴趣的朋友，欢迎加入知识星球一起交流学习，让我们一起变得更强。如果你觉得这个项目帮助到了你，你可以请作者喝杯咖啡表示鼓励☕。扫描下面微信二维码添加微信备注VF-Admin即可进群。
<table>
    <tr>
        <td><img alt="zsxq" src="https://gitee.com/insistence2022/RuoYi-Vue-FastAPI/raw/master/demo-pictures/zsxq.jpg"></td>
        <td><img alt="zanzhu" src="https://gitee.com/insistence2022/RuoYi-Vue-FastAPI/raw/master/demo-pictures/zanzhu.jpg"></td>
    </tr>
    <tr>
        <td><img alt="wxcode" src="https://gitee.com/insistence2022/RuoYi-Vue-FastAPI/raw/master/demo-pictures/wxcode.jpg"></td>
    </tr>
</table>