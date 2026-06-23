# 日程助手 App

基于 **React Native + Expo Router** 的移动端日程式 Todo 应用。支持按日期查看任务、增删改、切换完成状态、首页概览与数据统计；内置 Mock 模式可独立运行，也可切换到真实 Node.js 后端 API 联调。

## 技术栈

- **Expo SDK 54**（Expo Go 54 真机可扫码运行）
- **Expo Router** ~6（文件路由）
- **React 19.1.0** / **React Native 0.81.x**
- **TypeScript**
- **axios**（接口封装）
- **AsyncStorage**（本地存储）
- **react-native-reanimated** ~4.1.0（动画）
- **expo-linear-gradient** / **expo-blur**（视觉效果）

## 路由结构

```text
app/
├── _layout.tsx              # 根 Stack：登录态守卫
├── login.tsx                # 登录/注册页
├── settings.tsx             # 设置中心
├── stats.tsx                # 数据统计页
├── task-form.tsx            # 新增/编辑任务
├── task-detail/[id].tsx     # 任务详情
└── (tabs)/
    ├── _layout.tsx          # 底部 Tab 布局
    ├── index.tsx            # 首页
    ├── tasks.tsx            # 任务列表
    ├── calendar.tsx         # 日历占位
    ├── contacts.tsx         # 通讯占位
    └── profile.tsx          # 我的
```

## 目录结构

```text
src/
├── components/   # TaskCard / TaskForm / StatsRow / CategoryCards / ThemeSelector 等
├── hooks/        # useAuth / useTasks / useUserProfile / useTheme / useAnimated
├── services/     # api / taskService / userService / mockData
├── storage/      # tokenStorage
├── constants/    # categories / colors / config / styles / themes / designTokens
├── types/        # task / user 类型
└── utils/        # date / validators / alert
```

## 本地启动

```bash
npm install
npm start            # 或双击 start.bat（自动获取 IP 并启动）
```

> 要求 Node.js **≥ 20.19.4**。

## 真机调试

1. 手机安装 **Expo Go（SDK 54）**，电脑与手机同一局域网。
2. 运行 `npm start`，用 Expo Go 扫码。
3. 后端地址必须用电脑局域网 IP，如 `http://192.168.x.x:3000/api`。

## 环境变量

```env
# .env.example（模板，提交到仓库）
EXPO_PUBLIC_API_BASE_URL=http://192.168.x.x:3000/api
EXPO_PUBLIC_USE_MOCK=true
```

复制 `.env.example` 为 `.env.local`，填入真实配置。`.env.local` 已加入 `.gitignore`。

## Mock / 真实 API 切换

- `EXPO_PUBLIC_USE_MOCK=true`：使用 Mock 数据，不请求后端。
- `EXPO_PUBLIC_USE_MOCK=false`：调用真实后端。

接口规范参见 `API_SPEC.md`。

## 已实现功能

- 首页：统计卡片、重点任务、最近任务、快捷入口
- 任务列表：日期标签栏（7天）、FlatList、下拉刷新、悬浮新增
- 任务卡片：点击进详情、点按切换完成、长按删除
- 新增/编辑任务：字段校验、时间滚轮选择器
- 任务详情：完整字段展示、编辑/删除/切换状态
- 我的页面：用户信息、菜单列表、退出登录
- 数据统计页：任务概览（今日待办/发布事项/已完成）、分类统计（工作/个人/活动）
- 登录/注册：邮箱+密码、格式校验、密码显示/隐藏
- 登录态守卫：未登录自动跳转
- 多主题切换：3种主题 + 暗黑模式
- 设置中心：主题设置、暗黑模式开关
- Mock 模式独立运行 + 真实 API 可配置联调
- 跨平台弹窗适配

## 已知问题

- **网页端动画报错**：`react-native-reanimated@4.1.0` 在 Web 平台存在 logger 配置缺失的 bug，控制台会报 `Cannot read properties of undefined (reading 'level')`。该错误不影响手机端（Expo Go）正常使用，网页端功能基本可用。根本原因是 reanimated 4.x 与 `react-native-worklets` 的版本兼容问题，需等待上游修复或升级到 Expo Go 原生支持的版本。

## 常用命令

```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript 类型检查
npm test            # 单元测试
npm run security    # 依赖安全检查
```
