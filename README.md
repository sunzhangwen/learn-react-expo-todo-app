# Todo Mobile App (Expo SDK 54)

基于 React Native + Expo Router 的日程式 Todo 应用。

## 功能概览

- ✅ 首页：任务统计与快捷入口
- ✅ 任务列表：按日期查看、编辑、删除、切换完成状态
- ✅ 新增/编辑任务：完整的表单验证和提交
- ✅ 任务详情：查看任务信息、编辑、删除
- ✅ 我的页面：用户资料、任务统计、分类统计
- ✅ Mock 模式：完全独立运行，无需后端
- ✅ 多国语言：完整中文界面

## 技术栈

- **Expo SDK**: 54.0.0
- **React**: 19.1.0
- **React Native**: 0.81.0
- **Expo Router**: 文件路由
- **TypeScript**: 完整类型支持
- **axios**: HTTP 请求
- **AsyncStorage**: 本地数据存储
- **@expo/vector-icons**: 图标库

## 项目结构

```
project-root/
├── app/
│   ├── _layout.tsx                 # 根 Stack 布局
│   ├── login.tsx                   # 登录页
│   ├── task-form.tsx               # 任务表单（新增/编辑）
│   ├── task-detail/
│   │   └── [id].tsx                # 任务详情动态路由
│   └── (tabs)/
│       ├── _layout.tsx             # Tab 底部导航
│       ├── index.tsx               # 首页
│       ├── tasks.tsx               # 任务列表页
│       ├── calendar.tsx            # 日历占位页
│       ├── contacts.tsx            # 通讯占位页
│       └── profile.tsx             # 我的页面
├── src/
│   ├── components/                 # UI 组件
│   │   ├── Loading.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorState.tsx
│   │   ├── TaskCard.tsx
│   │   ├── DateTabs.tsx
│   │   └── TaskForm.tsx
│   ├── hooks/                      # 自定义 Hook
│   │   ├── useAuth.ts
│   │   ├── useTasks.ts
│   │   └── useUserProfile.ts
│   ├── services/                   # 业务服务
│   │   ├── api.ts
│   │   ├── taskService.ts
│   │   └── userService.ts
│   ├── storage/                    # 本地存储
│   │   └── tokenStorage.ts
│   ├── constants/                  # 常量配置
│   │   ├── config.ts
│   │   └── colors.ts
│   ├── types/                      # TypeScript 类型
│   │   ├── task.ts
│   │   └── user.ts
│   ├── utils/                      # 工具函数
│   │   ├── date.ts
│   │   └── validators.ts
│   └── mock/                       # Mock 数据
│       └── mockData.ts
├── app.json
├── package.json
├── tsconfig.json
├── .gitignore
├── .env.example
└── README.md
```

## 本地启动

### 1. 安装依赖

```bash
npm install --legacy-peer-deps
```

> 注意：使用 `--legacy-peer-deps` 标志是必需的，因为 Expo 54 生态中的某些包有 peer 依赖冲突。这不会影响应用的实际功能。

### 2. 启动开发服务

```bash
npm run start
```

### 3. 在 Expo Go 扫码运行

- iOS：用相机或 Expo Go 应用扫二维码
- Android：在 Expo Go 应用中扫二维码

### 其他命令

```bash
# 启动 Android 模拟器
npm run android

# 启动 iOS 模拟器
npm run ios

# 启动 Web 预览
npm run web
```

## 配置说明

### 环境变量

编辑 `.env.local`（本地文件，不提交）：

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.x.x:3000/api
EXPO_PUBLIC_USE_MOCK=true
```

- `EXPO_PUBLIC_API_BASE_URL`：后端 API 地址
  - Mock 模式：任何值都不会被实际使用
  - 真实模式：配置为实际后端地址（例如 `http://192.168.1.100:3000/api`）
  
- `EXPO_PUBLIC_USE_MOCK`：是否使用 Mock 模式
  - `true`：使用本地 Mock 数据，无需后端
  - `false`：调用真实后端 API

### 真机调试

1. **确保手机和电脑在同一网络**
2. **获取本机局域网 IP**（例如 `192.168.1.100`）
3. **更新 `.env.local`**：

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:3000/api
EXPO_PUBLIC_USE_MOCK=false
```

4. **启动 Expo 开发服务**：

```bash
npm run start
```

5. **在手机上用 Expo Go 扫二维码**

> ⚠️ 不要使用 `localhost` 或 `127.0.0.1`，真机无法访问

## Mock 模式

当 `EXPO_PUBLIC_USE_MOCK=true` 时：

- ✅ 不需要后端服务
- ✅ 所有接口都由本地数据模拟
- ✅ 模拟 300~500ms 网络延迟
- ✅ 支持新增、编辑、删除、切换完成状态
- ✅ 刷新页面不会丢失数据

### Mock 初始数据

```
1. 公司年终复盘会议 (工作 08:00-10:00)
2. 部门年终总结分享会 (工作 10:30-12:00)
3. 广州插画分享会 (活动 14:00-16:00 @西西弗书店)
4. 下班配钥匙 (个人 18:30 @下沙市场)
```

## 真实 API 联调

### 后端接口要求

任务接口：

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/tasks?date=YYYY-MM-DD` | 获取指定日期任务 |
| GET | `/tasks` | 获取全部任务 |
| GET | `/tasks/:id` | 获取任务详情 |
| POST | `/tasks` | 创建任务 |
| PUT | `/tasks/:id` | 更新任务 |
| PATCH | `/tasks/:id/status` | 更新完成状态 |
| DELETE | `/tasks/:id` | 删除任务 |

用户接口：

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/user/profile` | 获取用户资料 |
| POST | `/auth/logout` | 退出登录 |

### 响应格式

所有接口返回统一格式：

```json
{
  "success": true,
  "data": { /* 业务数据 */ },
  "message": "操作成功"
}
```

失败响应（HTTP 4xx/5xx）：

```json
{
  "success": false,
  "data": null,
  "message": "错误描述"
}
```

## 脱敏与安全

### GitHub 提交前检查

- ❌ 不提交真实 token
- ❌ 不提交真实账号密码
- ❌ 不提交 `.env.local`
- ✅ 提交 `.env.example` 作为模板
- ✅ `.gitignore` 包含敏感文件

### 正确的提交步骤

1. 复制 `.env.example` 并修改：

```bash
cp .env.example .env.local
# 编辑 .env.local，填入本地配置
```

2. 确认 `.gitignore` 包含 `.env.local`：

```
node_modules/
.expo/
.env.local
dist/
```

3. 提交到 GitHub 时 `.env.local` 会被自动忽略

## 已实现功能

- [x] 首页：统计卡片、最近任务、快捷按钮
- [x] 任务列表：日期筛选、下拉刷新、长按删除
- [x] 新增任务：分类、时间、地点、备注、验证
- [x] 编辑任务：保留原数据、支持修改所有字段
- [x] 任务详情：完整信息展示、编辑、删除、切换状态
- [x] 我的页面：用户资料、统计、分类、菜单、退出登录
- [x] Mock 模式：完整独立运行
- [x] 本地存储：token、用户信息、任务缓存
- [x] 错误处理：加载、错误、空状态、验证错误
- [x] 占位页面：日历、通讯

## 已实现但作为占位的功能

- 日历页面：仅展示"功能开发中"提示
- 通讯页面：仅展示"功能开发中"提示
- 我的页面菜单：点击展示"功能开发中"提示

## 不在此应用范围内

- 相机/定位/音视频
- EAS Build/EAS Update
- SQLite 离线数据库
- Redux/Zustand 状态管理
- 完整日历业务
- 完整通讯录业务
- 完整消息中心业务

## 常见问题

### Q: 如何切换 Mock 模式和真实 API？

编辑 `.env.local`：

```env
# Mock 模式（无需后端）
EXPO_PUBLIC_USE_MOCK=true

# 真实 API 模式
EXPO_PUBLIC_USE_MOCK=false
EXPO_PUBLIC_API_BASE_URL=http://your-backend:3000/api
```

修改后重启开发服务（`npm run start`）。

### Q: 真机调试时无法连接后端？

检查以下几点：

1. ✅ 手机和电脑在同一 WiFi
2. ✅ 防火墙未阻止后端端口（如 3000）
3. ✅ `.env.local` 中使用的是局域网 IP，不是 `localhost`
4. ✅ 后端服务已启动并监听正确的地址和端口

### Q: 刷新页面后数据丢失？

在 Mock 模式下，Mock 数据存储在内存中。页面刷新（R 键）会重新加载应用，导致数据重置为初始状态。这是预期行为。

在真实 API 模式下，数据持久化由后端负责，刷新页面会重新请求数据。

### Q: 如何添加新的任务分类？

编辑 `src/constants/colors.ts` 中的 `categoryColors` 和 `categoryNames`，然后在 `src/types/task.ts` 更新 `TaskCategory` 类型即可。

## 许可证

MIT

