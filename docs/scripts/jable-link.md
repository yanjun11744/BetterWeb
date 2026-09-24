# JavLibrary 番号跳转 Jable

源文件：[`scripts/javlibrary/jable-link.user.js`](../../scripts/javlibrary/jable-link.user.js)  
当前版本：`1.0`

## 功能

脚本运行在 JavLibrary 详情页，读取页面中的番号，并在番号右侧添加 Jable 图标按钮。点击按钮后，会在新标签页打开对应的 Jable 视频页面。

例如，番号 `START-644` 会生成：

```text
https://jable.tv/videos/start-644/
```

脚本会将番号转换为小写并进行 URL 编码，按钮提供悬停缩放效果，同时阻止 JavLibrary 页面原有点击事件干扰按钮。脚本会避免重复添加 `#jable-button`。

## 适用范围

- 页面：`http://www.javlibrary.com/*`、`https://www.javlibrary.com/*`
- 运行时机：`document-end`
- 权限：`GM_openInTab`
- 目标站点：`jable.tv`

## 安装与自动更新

- [直接安装](https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/javlibrary/jable-link.user.js)
- 脚本已配置 `@updateURL` 和 `@downloadURL`，用户脚本管理器会根据 `@version` 检查更新。

## 已知限制

- 脚本按固定的 `/videos/<番号>/` 规则生成地址，不会先查询 Jable 是否存在对应视频。
- 如果 Jable 的 URL 规则发生变化，需要同步修改脚本。
- 依赖 JavLibrary 使用 `#video_id .text` 保存番号。
- 依赖用户脚本管理器支持 `GM_openInTab`。
