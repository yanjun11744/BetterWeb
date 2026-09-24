# JavLibrary 番号搜索 Wuji

源文件：[`scripts/javlibrary/wuji-search.user.js`](../../scripts/javlibrary/wuji-search.user.js)  
当前版本：`1.1`

## 功能

脚本运行在 JavLibrary 详情页，读取页面中的番号，并在番号右侧添加 Wuji 图标按钮。点击按钮后，会在新标签页打开对应的 Wuji 搜索结果：

```text
https://wuji.me/search?q=<番号>
```

按钮使用 Wuji 网站图标，并提供悬停缩放效果。脚本会阻止 JavLibrary 页面原有点击事件干扰按钮，同时避免重复添加按钮。

## 适用范围

- 页面：`http://www.javlibrary.com/*`、`https://www.javlibrary.com/*`
- 运行时机：`document-end`
- 权限：`GM_openInTab`
- 搜索站点：`wuji.me`

## 安装与自动更新

- [直接安装](https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/javlibrary/wuji-search.user.js)
- 脚本已配置 `@updateURL` 和 `@downloadURL`，用户脚本管理器会根据 `@version` 检查更新。

## 已知限制

- 脚本只负责生成搜索地址，不会请求 Wuji 页面或查找具体详情页。
- 依赖 JavLibrary 使用 `#video_id .text` 保存番号。
- 依赖用户脚本管理器支持 `GM_openInTab`。
- Wuji 网站地址或搜索参数发生变化时，需要同步修改脚本。
