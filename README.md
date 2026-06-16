# 日程 Todo App

基于 **React Native + Expo Router** 的移动端日程式 Todo 应用。支持按日期查看任务、增删改、切换完成状态、首页概览与「我的」统计；内置 Mock 模式可独立运行，也可切换到真实 Node.js 后端 API 联调。

## 技术栈

- **Expo SDK 54**（Expo Go 54 真机可扫码运行）
- **Expo Router** ~6（文件路由，唯一主导航方案）
- **React 19.1.0** / **React Native 0.81.x**
- **TypeScript**（函数组件）
- **axios**（统一接口封装）
- **@react-native-async-storage/async-storage**（本地存储）
- **react-native-safe-area-context**（安全区域）
- **@expo/vector-icons**（图标）

> 所有 Expo 相关依赖均通过 `npx expo install` 对齐 SDK 54。

## Expo Router 路由结构

```text
app/
├── _layout.tsx              # 根 Stack：注册 Tab 组 / 登录 / 任务表单 / 任务详情
├── login.tsx                # 登录占位页
├── task-form.tsx            # 新增 / 编辑共用表单页
├── task-detail/[id].tsx     # 任务详情页（动态路由）
└── (tabs)/
    ├── _layout.tsx          # 底部 Tab 布局
    ├── index.tsx            # 首页
    ├── tasks.tsx            # 任务列表页
    ├── calendar.tsx         # 日历占位页
    ├── contacts.tsx         # 通讯占位页
    └── profile.tsx          # 我的页面
```

导航约定：

- 新增任务：`/task-form?mode=create&date=YYYY-MM-DD`
- 编辑任务：`/task-form?mode=edit&id=<taskId>`
- 任务详情：`/task-detail/<taskId>`
- 退出登录：`router.replace('/login')`

## 项目目录结构

```text
src/
├── components/   # 通用与业务组件（TaskCard / TaskForm / DateTabs / 状态组件等）
├── hooks/        # useAuth / useTasks / useUserProfile
├── services/     # api(axios 实例) / taskService / userService / mockData
├── storage/      # tokenStorage（AsyncStorage 封装）
├── constants/    # categories / colors / config / styles
├── types/        # task / user 类型
└── utils/        # date / validators
```

## 全局样式

统一定义在 `src/constants/styles.ts`，通过 `globalStyles` 导出，避免各组件重复定义：

| 样式名 | 用途 |
| --- | --- |
| `safe` | 页面安全区域容器（flex:1 + 背景色） |
| `center` | 居中布局容器 |
| `card` | 白色卡片（圆角 + 背景色） |
| `header` / `headerTitle` | 页面头部布局与标题 |
| `title` / `subtitle` | 章节标题 / 副标题 |
| `textPrimary` / `textSecondary` / `textTertiary` | 不同层级的文字样式 |
| `primaryButton` / `primaryButtonText` | 主色按钮及文字 |
| `secondaryButton` / `secondaryButtonText` | 描边按钮及文字 |
| `flex` | flex:1 容器 |
| `content` | 内容区域（水平内边距 + 间距） |
| `sectionTitle` | 章节标题 |
| `divider` | 分割线 |
| `errorText` | 错误提示文字 |

使用示例：

```tsx
import { globalStyles } from '@/constants/styles';

<View style={globalStyles.safe}>
  <View style={globalStyles.header}>
    <Text style={globalStyles.headerTitle}>标题</Text>
  </View>
  <Text style={globalStyles.textSecondary}>次要文字</Text>
</View>
```

## 本地启动

```bash
# 1. 安装依赖
npm install

# 2.（可选）校正依赖版本，确保与 SDK 54 对齐
npx expo install --check    # 或 npx expo install --fix

# 3. 启动开发服务器
npm start
```

> 要求 Node.js **≥ 20.19.4**（Expo SDK 54 的硬性下限）。

## Expo Go 54 真机调试

1. 手机安装 **Expo Go（SDK 54）**。
2. 电脑与手机连接到同一局域网。
3. 运行 `npm start`，用 Expo Go 扫描终端二维码。
4. 真机访问后端时 **不要用 `localhost`**，必须用电脑局域网 IP，例如 `http://192.168.x.x:3000/api`。

## 配置与环境变量

统一配置入口：`src/constants/config.ts`，集中管理 API 地址、Mock 开关、超时时间、存储 key、应用名、默认分类。

客户端可公开配置使用 `EXPO_PUBLIC_` 前缀：

```env
# .env.example（模板，提交到仓库）
EXPO_PUBLIC_API_BASE_URL=http://192.168.x.x:3000/api
EXPO_PUBLIC_USE_MOCK=true
```

- 复制 `.env.example` 为 `.env.local`，填入本机真实 API 地址与 Mock 开关。
- `.env.local` 已加入 `.gitignore`，**不提交到 GitHub**。

## Mock 模式 / 真实 API 切换

- `EXPO_PUBLIC_USE_MOCK=true`：使用集中维护的 Mock 数据（`src/services/mockData.ts`），不请求后端，支持增删改与状态切换，接口模拟 300~500ms 延迟。
- `EXPO_PUBLIC_USE_MOCK=false`：调用真实后端，地址取 `EXPO_PUBLIC_API_BASE_URL`。

接口约定（真实模式）：

| 函数 | 方法 | 路径 |
| --- | --- | --- |
| `getTasks(date)` | GET | `/tasks?date=YYYY-MM-DD` |
| `getAllTasks()` | GET | `/tasks` |
| `getTaskById(id)` | GET | `/tasks/:id` |
| `createTask(payload)` | POST | `/tasks` |
| `updateTask(id, payload)` | PUT | `/tasks/:id` |
| `updateTaskStatus(id, status)` | PATCH | `/tasks/:id/status` |
| `deleteTask(id)` | DELETE | `/tasks/:id` |
| `getProfile()` | GET | `/user/profile` |
| `logout()` | POST | `/auth/logout` |

## GitHub 提交前脱敏

- 不提交真实 token / 账号密码 / 内网地址 / `.env.local`。
- 提交 `.env.example` 作为模板。
- `EXPO_PUBLIC_*` 变量视为公开信息，不存放任何秘密；真正敏感的密钥只放后端或 CI/CD Secret。

## 已实现功能

- [x] 首页：统计卡片、重点任务（支持多个）、最近任务、快捷入口，含 loading / empty / error 状态
- [x] 任务列表页：日期标签栏（7 天）、FlatList、下拉刷新、悬浮新增按钮
- [x] 任务卡片：点击进详情、点按切换完成、长按删除确认、重点任务星标显示
- [x] 新增 / 编辑任务：字段校验、键盘避让、提交禁用态、重点任务开关
- [x] 任务详情：完整字段展示、编辑 / 删除 / 切换状态、重点任务状态
- [x] 我的页面：用户信息、任务统计、分类统计、菜单、退出登录
- [x] 日历 / 通讯占位页：「功能开发中，敬请期待」
- [x] 登录占位页：模拟登录
- [x] Mock 模式独立运行 + 真实 API 可配置联调
- [x] 本地缓存：请求成功写缓存，失败读缓存恢复
- [x] 全局样式抽取（`globalStyles`），减少组件重复定义

## 常见问题

- **真机连不上后端**：确认手机与电脑同一局域网，且 `EXPO_PUBLIC_API_BASE_URL` 用的是电脑局域网 IP 而非 `localhost`。
- **依赖版本告警**：运行 `npx expo install --fix` 让所有依赖对齐 SDK 54。
- **Expo Go 打不开**：确认 Expo Go 为 SDK 54 版本，Node ≥ 20.19.4。

## 常用命令

```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript 类型检查
npm test            # 单元测试（jest）
npm run security    # 依赖安全检查（npm audit）
```
