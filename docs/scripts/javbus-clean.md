# JavBus 去广告

源文件：[`scripts/javbus/javbus-clean.user.js`](../../scripts/javbus/javbus-clean.user.js)  
当前版本：`2.0`

## 功能

脚本清理 JavBus 首页、列表页和详情页中的常见广告元素，包括：

- `.ad-box`、`.ad-item`、`.ad-juicy` 等广告容器；
- `.banner728`、`.banner300`、`.bcpic2` 等横幅广告；
- `#bob` 和 `#tb` 广告区块；
- 详情页 `.row` 内的 iframe；
- 来自 JuicyAds 的脚本和 iframe；
- `/ads/` 路径下的广告图片及其链接容器。

脚本先添加 CSS 隐藏规则以减少广告闪现，再移除已识别的广告节点。页面初次清理后会观察 DOM 变化，处理网站后续动态插入的广告。

## 适用范围

- 页面：JavBus 的 HTTP / HTTPS 根域名及子域名
- 运行时机：`document-idle`
- 权限：无（`@grant none`）

## 安装与自动更新

- [直接安装](https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/javbus/javbus-clean.user.js)
- 脚本已配置 `@updateURL` 和 `@downloadURL`，用户脚本管理器会根据 `@version` 检查更新。

## 已知限制

- 清理规则基于当前识别到的 CSS 选择器和资源 URL 特征；JavBus 改版后可能需要调整。
- `.row iframe` 会整体移除，若页面该区域出现非广告 iframe，也会一并移除。
- 本脚本只处理页面广告元素，不拦截所有类型的弹窗或浏览器级跳转。
