# JavLibrary 演员搜索 JavFree

源文件：[`scripts/javlibrary/javfree-actor-search.user.js`](../../scripts/javlibrary/javfree-actor-search.user.js)  
当前版本：`1.0`

## 功能

脚本运行在 JavLibrary 详情页，为每位出演者的名字后面添加 JavFree 图标按钮。

点击按钮后，会在新标签页打开对应演员的 JavFree 搜索结果页。例如：

```text
演员名：Jane Doe
搜索地址：https://javfree.me/?s=Jane%20Doe
```

按钮使用与其他 JavLibrary 快捷按钮一致的图标和悬停缩放效果，并带有无障碍标签和提示文字。

## 适用范围

- 页面：`http://www.javlibrary.com/*`、`https://www.javlibrary.com/*`
- 运行时机：`document-end`
- 权限：`GM_openInTab`
- 目标站点：`javfree.me`

## 安装与自动更新

- [直接安装](https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/javlibrary/javfree-actor-search.user.js)
- 脚本已配置 `@updateURL` 和 `@downloadURL`，用户脚本管理器会根据 `@version` 检查更新。

## 已知限制

- 脚本依赖 JavLibrary 使用 `#video_cast` 保存出演者列表，并优先处理其中的演员链接。
- 脚本只生成 JavFree 搜索地址，不会预先确认演员或视频是否存在。
- 如果 JavLibrary 修改出演者区域的 HTML 结构，可能需要更新选择器。
