# JavLibrary 防广告跳转

源文件：[`scripts/javlibrary/no-ad-redirect.user.js`](../../scripts/javlibrary/no-ad-redirect.user.js)  
当前版本：`1.1`

## 功能

脚本在 JavLibrary 页面尽早建立跳转拦截规则，用于减少常见广告链接和广告弹窗带来的误触。它会：

- 包装 `window.open`，拦截不在允许域名范围内的新窗口请求；
- 捕获页面点击事件，拦截指向外部域名的链接；
- 允许 JavLibrary 和 JavFree 的 HTTP / HTTPS 链接正常跳转；
- 对被拦截的地址在控制台输出日志，便于排查误拦截。

## 适用范围

- 页面：`http://www.javlibrary.com/*`、`https://www.javlibrary.com/*`
- 运行时机：`document-start`
- 权限：无（`@grant none`）

允许的主机包括：

- `javlibrary.com` 及其子域名；
- `www.javlibrary.com`；
- `javfree.me` 及其子域名；
- `www.javfree.me`。

其他协议（例如 `javascript:`）和其他主机默认视为不允许。

## 与其他脚本的关系

本脚本只负责拦截跳转，不负责查找或生成 JavFree 链接。它可以单独使用，也可以和 [JavLibrary 番号跳转 JavFree](javfree-link.md) 同时安装；后者生成的 JavFree 链接会被本脚本放行。

## 自动更新与安装

- [直接安装](https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/javlibrary/no-ad-redirect.user.js)
- `@updateURL` 和 `@downloadURL` 均指向该 Raw 地址。

## 已知限制

- 允许域名是固定列表，不适用于需要跳转到其他合法站点的场景。
- 网站若使用非链接元素、特殊事件或其他方式发起跳转，可能无法被该脚本拦截。
- 某些站内功能如果依赖外部域名，可能会被视为广告并阻止；遇到误拦截时应检查控制台日志。
