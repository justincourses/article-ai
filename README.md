# Article Render

简体中文

## 简介

Article Render 是一个使用 Next.js 15 构建的现代文章渲染应用，集成了 Clerk 提供的身份验证功能。它允许用户创建、查看和管理文章，并提供清晰、响应式的界面。

## 本地开发

### 前置条件

- Node.js（推荐最新的 LTS 版本）
- npm 或 yarn
- Clerk 账户（用于身份验证）

### 安装与设置

1. 克隆仓库：
   ```bash
   git clone https://github.com/yourusername/article-render
   cd article-render
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 在根目录创建 `.env.local` 文件，并添加以下环境变量：
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
   CLERK_SECRET_KEY=your_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
   ```

### 本地运行

项目使用 Next.js 的 Turbopack 以提供更快的开发体验：

```bash
npm run dev
```

这将启动带有 Turbopack 的开发服务器。访问 http://localhost:3000 即可查看应用。

其他可用的脚本：
- `npm run build` - 构建生产环境的应用
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行代码检查

## 在 Vercel 上部署

### 重要配置说明

由于扩展了函数执行时间，本项目在 Vercel 上需要特殊配置：

1. 项目使用 `vercel.json` 配置，为 API 路由设置了 800 秒的 `maxDuration`：
   ```json
   {
     "functions": {
       "app/api/**/*": {
         "maxDuration": 800
       }
     }
   }
   ```

2. **需要 Vercel Pro 套餐**：要使用 800 秒的函数执行时间，您必须：
   - 订阅 Vercel Pro 套餐
   - 为您的函数启用 **Fluid Compute**（流体计算）
   - 没有 Pro 套餐，您将被限制在 60 秒
   - 有 Pro 套餐但没有启用 Fluid Compute，您将被限制在 300 秒

### 部署步骤

1. 将代码推送到 Git 仓库（GitHub、GitLab 或 Bitbucket）

2. 在 Vercel 控制面板中导入您的项目

3. 配置所需的环境变量：
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - 以及应用需要的其他环境变量

4. 部署后，如果使用 Pro 套餐，请前往：
   - 项目设置 → Functions → Function Execution（函数执行）
   - 启用 Fluid Compute（流体计算）
   - 这将允许 vercel.json 中指定的 800 秒执行时间

5. 部署您的应用

您也可以使用下面的部署按钮：

[Deploy with Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjustincourses%2Farticle-ai&env=CLERK_SECRET_KEY,NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY&envDescription=Your%20Clerk%20application%20keys%2C%20accessible%20from%20dashboard.clerk.com.&envLink=https%3A%2F%2Fgithub.com%2Fjustincourses%2Farticle-ai%23%E6%9C%AC%E5%9C%B0%E8%BF%90%E8%A1%8C&demo-url=https%3A%2F%2Farticle-render.vercel.app%2F)

## 图片配置

应用已配置为使用来自 Unsplash 的图片。域名已在 `next.config.js` 中配置：

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
      port: '',
    },
    {
      protocol: 'https',
      hostname: 'plus.unsplash.com',
      port: '',
    },
  ],
},
```

如果需要使用其他域名的图片，请将它们添加到 `next.config.js` 中的 `remotePatterns` 数组中。
