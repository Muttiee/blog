# lantian 静态博客（Hugo）

这是从原先的单文件页面改造出的 Hugo 版本。首页、文章卡片、浅绿背景和文章目录沿用原页面的风格。现在每篇文章有自己的 Markdown 文件。

## 第一次使用

1. 你电脑上的 Hugo 位于 `D:\software\hugo\hugo.exe`，目前不必重复安装。在 PowerShell 中进入本项目目录，运行：

   ```powershell
   cd 'D:\学习\网站建设\rackora-hugo'
   & 'D:\software\hugo\hugo.exe' server -D
   ```

2. 浏览器打开终端显示的本地地址，通常是 `http://localhost:1313/`。编辑文章并保存后，预览会自动刷新。要停止预览，在终端按 `Ctrl+C`。
3. 用 Obsidian 打开 `content/posts` 文件夹作为仓库。编辑 `welcome/index.md`，即可看到网页自动更新。

Hugo 安装说明：[官方 Windows 文档](https://gohugo.io/installation/windows/)。

## 发布新文章

复制 `content/posts/welcome` 文件夹，改成一个独一无二的英文名称，例如 `content/posts/my-day/`。打开其中的 `index.md`，修改文件顶部的标题、日期、分类、标签和正文：

```markdown
---
title: "我的新文章"
date: 2026-11-06T00:00:00+08:00
description: "首页显示的文章简介。"
categories: ["随笔"]
tags: ["生活"]
draft: false
---

这里开始写正文。

## 小标题

这个小标题会显示在文章目录里。
```

图片放在同一篇文章的文件夹中，正文写 `![图片说明](photo.jpg)`。Obsidian 中建议使用普通 Markdown 图片链接；`![[photo.jpg]]` 和 `[[另一篇文章]]` 是 Obsidian 专有写法，发布前要转换。Notion 的文章可选择 **导出 → Markdown & CSV**，然后把 `.md` 和图片放入文章文件夹，补齐顶部的标题和日期。

写完后将项目文件提交到 GitHub。保存到 Obsidian 或 Notion 本身不会自动发布。

## GitHub Pages

把本目录中的源文件上传到 GitHub 仓库根目录。在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。当前仓库 `Muttiee/blog` 使用 `master` 分支；提交到 `master` 时，`.github/workflows/hugo.yaml` 会用 Hugo 构建并发布网站。工作流会自动取得仓库的 GitHub Pages 地址，不需要预先填写用户名或仓库名。

如果沿用当前仓库，先删除旧的 `.github/workflows/static.yml`。它会把整个仓库直接当作网站发布，与 Hugo 的发布流程冲突。根目录旧 `index.html` 可以在 Hugo 网站成功上线后删除。

项目使用的 Hugo 发布流程参考：[Hugo 官方说明](https://gohugo.io/host-and-deploy/deploy-to-github-pages/)。生成的 `public/` 文件夹无需上传。

## 常用文件

| 文件 | 用途 |
| --- | --- |
| `hugo.toml` | 站名、简介等站点设置 |
| `content/posts/` | 文章和随文章保存的图片 |
| `content/about.md` | 关于页面 |
| `layouts/` | 页面结构 |
| `static/css/site.css` | 颜色、字体和排版 |
| `.github/workflows/hugo.yaml` | GitHub Pages 自动发布 |

目前只做了写文章和阅读所需的基本页面；评论服务和站内搜索可以后续再接入。
