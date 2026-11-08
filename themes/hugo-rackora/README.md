# Hugo Rackora

这个主题把 `halo-theme-rackora` 的绿色、留白、卡片和阅读布局移植到 Hugo。首页显示文章、分类和标签；文章页提供宽屏侧边目录、手机目录按钮、搜索与深浅色切换。

在站点的 `hugo.yaml` 中使用：

```yaml
theme:
  - hugo-rackora
  - hugo-narrow
```

第二个主题只为兼容原站已有的短代码和图片渲染规则；新主题的主要页面和样式来自 `hugo-rackora`。现有文章放在站点的 `content/posts/` 中，无需迁移。

站点名称在站点根目录的 `hugo.yaml` 中设置。可选的站点描述和平台链接示例：

```yaml
params:
  subtitle: 记录技术、生活与途中所见。
  tagline: 清晰表达，长期可读
  socials:
    - name: GitHub
      url: https://github.com/your-name
```

主题模板在 `layouts/`，颜色和排版在 `static/css/site.css`，交互在 `static/js/site.js`。预览时在站点目录运行 `hugo server -D`。
