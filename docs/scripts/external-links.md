# JavLibrary 外部站点快捷按钮

源文件：[`scripts/javlibrary/external-links.user.js`](../../scripts/javlibrary/external-links.user.js)  
当前版本：`1.0`

## 功能

脚本在 JavLibrary 详情页的番号右侧一次性添加三个快捷按钮，顺序固定为：

```text
[JavFree] [Wuji] [Jable]
```

### JavFree

先打开 JavFree 搜索地址作为备用目标，并在后台查询搜索结果。找到匹配的真实详情页后，按钮会自动改为详情页地址；查询失败时仍可打开搜索页。

### Wuji

根据番号打开 Wuji 搜索页：

```text
https://wuji.me/search?q=<番号>
```

### Jable

将番号转换为小写后，直接打开对应视频页：

```text
https://jable.tv/videos/<小写番号>/
```

## 设计说明

三个按钮共享番号读取、按钮创建、图标样式、悬停效果和新标签页打开逻辑。服务差异通过配置中的 `getURL` 函数处理，因此按钮顺序和样式只需维护一份。

## 适用范围与权限

- 页面：`http://www.javlibrary.com/*`、`https://www.javlibrary.com/*`
- 运行时机：`document-end`
- 权限：`GM_xmlhttpRequest`、`GM_openInTab`
- 跨域权限：`javfree.me`

## 安装与自动更新

- [直接安装](https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/javlibrary/external-links.user.js)
- 脚本已配置 `@updateURL` 和 `@downloadURL`，用户脚本管理器会根据 `@version` 检查更新。

## 已知限制

- JavFree 依赖其搜索页面结构，网站改版后可能需要更新匹配规则。
- Wuji 和 Jable 使用固定 URL 规则，不会预先确认目标页面是否存在。
- 依赖 JavLibrary 使用 `#video_id .text` 保存番号。
- 依赖用户脚本管理器支持 `GM_openInTab` 和 `GM_xmlhttpRequest`。
