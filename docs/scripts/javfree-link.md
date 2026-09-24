# JavLibrary 番号跳转 JavFree

源文件：[`scripts/javlibrary/javfree-link.user.js`](../../scripts/javlibrary/javfree-link.user.js)  
当前版本：`1.5`

## 功能

脚本运行在 JavLibrary 详情页。页面加载完成后，它会读取 `#video_id .text` 中的番号，在番号旁添加 JavFree 图标按钮，同时向 JavFree 发起搜索请求。找到对应详情页后，脚本会把按钮地址更新为详情页；如果查找失败，则保留 JavFree 搜索页地址。

- 在番号后显示 JavFree 网站图标按钮；
- 默认使用 JavFree 搜索页作为备用地址；
- 找到匹配结果后跳转到对应详情页；
- 使用新标签页打开页面，并提供悬停缩放效果；
- 阻止页面已有点击事件继续干扰该链接，但保留浏览器原生的 `target="_blank"` 行为。

## 适用范围

- 页面：`http://www.javlibrary.com/*`、`https://www.javlibrary.com/*`
- 运行时机：`document-end`
- 权限：`GM_xmlhttpRequest`
- 跨域目标：`javfree.me`

## 查找规则

脚本会把番号去除空白并转为小写，然后检查 JavFree 搜索结果中的链接是否同时满足以下条件：

1. 主机名为 `javfree.me` 或其子域名；
2. 路径以清理后的番号结尾；
3. 路径包含数字目录结构。

找不到匹配结果或请求失败时，按钮仍然可以打开 JavFree 搜索页，并在控制台记录提示，不会阻塞 JavLibrary 页面。脚本还会避免重复添加 `#javfree-button`。

## 自动更新与安装

- [直接安装](https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/javlibrary/javfree-link.user.js)
- `@updateURL` 和 `@downloadURL` 均指向该 Raw 地址。

## 已知限制

- 依赖 JavFree 搜索页面的 HTML 结构；对方改版后可能需要更新匹配规则。
- 依赖用户脚本管理器允许访问 `javfree.me`。
- 搜索失败时不会重试，也不会生成猜测链接。
- 仅处理页面初始的番号元素，不负责监听后续由其他脚本动态创建的内容。
