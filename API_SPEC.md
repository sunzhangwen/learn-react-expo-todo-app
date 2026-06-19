# 日程助手 后端接口规范

> 本文档根据前端代码 `src/services/` 层逆向生成，供后端开发直接对接。

---

## 1. 基础约定

| 项目 | 值 |
|------|-----|
| 基础路径 | `/api` |
| 协议 | HTTP / HTTPS |
| Content-Type | `application/json` |
| 请求超时 | 10 秒 |
| 认证方式 | Bearer Token（请求头 `Authorization: Bearer <token>`） |
| 日期格式 | ISO 8601（`YYYY-MM-DD`） |
| 时间格式 | 24 小时制 `HH:mm` |
| 时间戳格式 | ISO 8601 完整时间（`YYYY-MM-DDTHH:mm:ss.sssZ`） |

### 1.1 统一响应格式

所有接口返回以下 JSON 结构：

```json
{
  "success": true,
  "data": {},
  "message": "操作成功"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `success` | `boolean` | 请求是否成功 |
| `data` | `T` | 业务数据，类型因接口而异 |
| `message` | `string` | 提示信息 |

### 1.2 错误响应

| HTTP 状态码 | 说明 | 前端行为 |
|-------------|------|----------|
| 200 | 成功 | 正常处理 |
| 400 | 参数错误 | 显示错误信息 |
| 401 | 未认证/Token 失效 | 清除本地 Token，跳转登录页 |
| 404 | 资源不存在 | 显示错误信息 |
| 500 | 服务器内部错误 | 显示"网络异常，请稍后重试" |

错误响应 body：
```json
{
  "message": "错误描述信息"
}
```

### 1.3 认证 Token

- 前端登录成功后会将 Token 存入本地 `AsyncStorage`
- 后续所有请求（除登录/注册外）在 Header 中携带 `Authorization: Bearer <token>`
- 后端验证失败返回 401，前端会自动清除本地 Token 并跳转登录页

---

## 2. 接口列表

### 2.1 认证相关

#### POST /auth/login — 用户登录

> ⚠️ 当前前端使用 Mock 登录，此接口为预留。前端切换 `USE_MOCK=false` 后需要此接口。

**请求体：**
```json
{
  "email": "string",
  "password": "string"
}
```

**响应 `data`：**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "avatar": "string | null",
    "stats": {
      "todayPending": 0,
      "totalPublished": 0,
      "totalCompleted": 0
    },
    "categories": {
      "work": 0,
      "personal": 0,
      "activity": 0
    }
  }
}
```

---

#### POST /auth/logout — 用户登出

**请求头：** 需携带 Token

**响应 `data`：** `null`

```json
{
  "success": true,
  "data": null,
  "message": "已退出登录"
}
```

---

### 2.2 任务相关

#### GET /tasks — 获取所有任务

**响应 `data`：** `Task[]`

```json
[
  {
    "id": "t_1234567890_001",
    "title": "公司年终复盘会议",
    "category": "work",
    "startTime": "08:00",
    "endTime": "10:00",
    "location": "会议室A",
    "note": "准备PPT",
    "date": "2026-06-18",
    "status": "pending",
    "isFeatured": true,
    "createdAt": "2026-06-18T00:00:00.000Z",
    "updatedAt": "2026-06-18T00:00:00.000Z"
  }
]
```

---

#### GET /tasks?date={date} — 按日期获取任务

**查询参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `date` | `string` | 是 | 日期，格式 `YYYY-MM-DD` |

**响应 `data`：** `Task[]`（仅返回该日期的任务）

---

#### GET /tasks/{id} — 获取单个任务详情

**路径参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 任务 ID |

**响应 `data`：** `Task | null`

任务不存在时返回 `{ "success": true, "data": null, "message": "操作成功" }`

---

#### POST /tasks — 创建任务

**请求体（`TaskPayload`）：**

```json
{
  "title": "string（必填）",
  "category": "work | personal | activity（必填）",
  "startTime": "HH:mm（必填）",
  "endTime": "HH:mm（可选）",
  "location": "string（可选）",
  "note": "string（可选）",
  "date": "YYYY-MM-DD（必填）",
  "status": "pending | completed（必填）",
  "isFeatured": false
}
```

**响应 `data`：** `Task`（包含服务端生成的 `id`、`createdAt`、`updatedAt`）

```json
{
  "success": true,
  "data": {
    "id": "生成的唯一ID",
    "title": "...",
    "...": "...",
    "createdAt": "2026-06-18T12:00:00.000Z",
    "updatedAt": "2026-06-18T12:00:00.000Z"
  },
  "message": "创建成功"
}
```

---

#### PUT /tasks/{id} — 更新任务

**路径参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 任务 ID |

**请求体：** 同 `TaskPayload`（全量更新）

**响应 `data`：** `Task`（更新后的完整任务对象）

任务不存在时应返回 404 或错误消息。

---

#### PATCH /tasks/{id}/status — 更新任务状态

**路径参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 任务 ID |

**请求体：**

```json
{
  "status": "pending | completed"
}
```

**响应 `data`：** `Task`（更新后的完整任务对象）

---

#### DELETE /tasks/{id} — 删除任务

**路径参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 任务 ID |

**响应 `data`：**

```json
{
  "id": "被删除的任务ID"
}
```

---

### 2.3 用户相关

#### GET /user/profile — 获取用户信息

**响应 `data`：** `UserProfile`

```json
{
  "id": "u_10086",
  "name": "小张同学",
  "email": "zhangsan@example.com",
  "avatar": "https://example.com/avatar.jpg",
  "stats": {
    "todayPending": 3,
    "totalPublished": 10,
    "totalCompleted": 7
  },
  "categories": {
    "work": 5,
    "personal": 3,
    "activity": 2
  }
}
```

| 字段 | 说明 |
|------|------|
| `stats.todayPending` | 今日待办任务数 |
| `stats.totalPublished` | 总任务数 |
| `stats.totalCompleted` | 已完成任务数 |
| `categories.work` | 工作类任务总数 |
| `categories.personal` | 个人类任务总数 |
| `categories.activity` | 活动类任务总数 |

---

## 3. 数据模型

### 3.1 Task（任务）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `string` | 服务端生成 | 唯一标识 |
| `title` | `string` | 是 | 任务标题 |
| `category` | `enum` | 是 | 分类：`work` / `personal` / `activity` |
| `startTime` | `string` | 是 | 开始时间 `HH:mm` |
| `endTime` | `string` | 否 | 结束时间 `HH:mm` |
| `location` | `string` | 否 | 地点 |
| `note` | `string` | 否 | 备注 |
| `date` | `string` | 是 | 日期 `YYYY-MM-DD` |
| `status` | `enum` | 是 | 状态：`pending` / `completed` |
| `isFeatured` | `boolean` | 是 | 是否重要/置顶 |
| `createdAt` | `string` | 服务端生成 | 创建时间 ISO 8601 |
| `updatedAt` | `string` | 服务端生成 | 更新时间 ISO 8601 |

### 3.2 TaskPayload（创建/更新请求体）

与 Task 相同，但不含 `id`、`createdAt`、`updatedAt`（由服务端维护）。

### 3.3 UserProfile（用户信息）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 用户 ID |
| `name` | `string` | 用户名 |
| `email` | `string` | 邮箱 |
| `avatar` | `string \| null` | 头像 URL，可选 |
| `stats` | `object` | 统计数据（见 2.3） |
| `categories` | `object` | 分类统计（见 2.3） |

---

## 4. 接口调用流程

### 4.1 登录流程

```
前端 → POST /auth/login → 后端返回 token + user
前端存储 token 和 user 到 AsyncStorage
后续请求自动携带 Authorization: Bearer <token>
```

### 4.2 任务加载流程

```
首页加载 → GET /tasks?date=YYYY-MM-DD → 返回当日任务列表
任务详情 → GET /tasks/{id} → 返回单个任务
所有任务 → GET /tasks → 返回全部任务（用于统计）
```

### 4.3 任务操作流程

```
创建任务 → POST /tasks → 返回新任务（含 id）
编辑任务 → PUT /tasks/{id} → 返回更新后任务
切换状态 → PATCH /tasks/{id}/status → 返回更新后任务
删除任务 → DELETE /tasks/{id} → 返回 { id }
```

### 4.4 个人中心流程

```
进入"我的"页 → GET /user/profile → 返回用户信息和统计数据
```

---

## 5. 注意事项

1. **ID 生成**：任务 ID 由后端生成，前端 Mock 使用 `t_{timestamp}_{random}` 格式，后端可自行设计。
2. **统计字段**：`UserProfile` 中的 `stats` 和 `categories` 由后端实时计算，不要求前端传递。
3. **时间选择器**：前端使用滚动选择器（TimePickerModal），传给后端的格式固定为 `HH:mm`。
4. **任务排序**：前端按 `startTime` 升序排列，后端可不排序但推荐。
5. **isFeatured**：重要标记，非分类，与 `work/personal/activity` 无关。
6. **401 处理**：前端收到 401 会自动清除本地 Token 并跳转登录页，后端返回 401 即可。

---

## 6. 环境配置

前端 `.env` 文件：

```
EXPO_PUBLIC_API_BASE_URL=http://<服务器IP>:3000/api
EXPO_PUBLIC_USE_MOCK=false
```

- `EXPO_PUBLIC_API_BASE_URL`：后端接口基础地址
- `EXPO_PUBLIC_USE_MOCK`：设为 `false` 启用真实后端接口

---

## 7. 快速验证

后端启动后可用 curl 验证：

```bash
# 登录（预留）
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'

# 获取用户信息
curl http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer <token>"

# 获取今日任务
curl "http://localhost:3000/api/tasks?date=2026-06-18" \
  -H "Authorization: Bearer <token>"

# 创建任务
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"测试任务","category":"work","startTime":"09:00","date":"2026-06-18","status":"pending","isFeatured":false}'

# 更新任务状态
curl -X PATCH http://localhost:3000/api/tasks/{id}/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"status":"completed"}'

# 删除任务
curl -X DELETE http://localhost:3000/api/tasks/{id} \
  -H "Authorization: Bearer <token>"
```
