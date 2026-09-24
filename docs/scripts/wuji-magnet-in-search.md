# Wuji 搜索结果直接磁力

源文件：[`scripts/wuji.me/magnet-in-search.user.js`](../../scripts/wuji.me/magnet-in-search.user.js)  
当前版本：`1.0`

## 功能

脚本运行在 Wuji 搜索结果页，为搜索结果中的资源详情链接增加磁力工具栏。无需逐个打开详情页，脚本会：

- 自动识别 Wuji 资源详情链接（例如 `/!lUL0`）；
- 并发请求详情页，最多同时处理 4 个资源；
- 直接读取详情页中的 `magnet:` 输入框或链接；
- 如果页面没有完整磁力链接，则从种子特征码 / info hash 生成磁力链接；
- 在结果标题旁显示“磁力链接”和“复制”按钮；
- 使用 `GM_setClipboard` 将磁力链接复制到剪贴板；
- 监听动态加载的搜索结果并自动处理新增项目。

## 适用范围

- 页面：`https://wuji.me/search*`、`https://www.wuji.me/search*`
- 运行时机：`document-end`
- 权限：`GM_setClipboard`
- 详情页请求：使用当前站点会话获取 Wuji 详情页

## 获取规则

脚本按以下顺序获取磁力链接：

1. 查找 `input[value^="magnet:?"]`；
2. 查找 `a[href^="magnet:?"]`；
3. 从“种子特征码”“info hash”等文本中识别 40 位十六进制或 32 位 Base32 哈希，并生成标准 BTIH 磁力链接。

每个资源只会处理一次。请求失败或没有找到有效哈希时，工具栏显示“磁力获取失败”，不会修改原始搜索结果链接。

## 安装与自动更新

- [直接安装](https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/wuji.me/magnet-in-search.user.js)
- 脚本已配置正确的 `@updateURL` 和 `@downloadURL`，用户脚本管理器会根据 `@version` 检查更新。

## 已知限制

- 依赖 Wuji 搜索结果和详情页的 HTML 结构，网站改版后可能需要更新选择器。
- 只能处理当前脚本识别到的详情链接格式。
- 复制功能依赖用户脚本管理器提供 `GM_setClipboard` 权限。
- 脚本本身不下载磁力内容，只负责提取、展示和复制磁力链接。
