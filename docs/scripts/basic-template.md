# BetterWeb 基础模板

源文件：[`templates/basic.user.js`](../../templates/basic.user.js)  
当前模板版本：`0.1.0`

## 用途

这是新增用户脚本时使用的最小模板，包含常用的元数据区和严格模式包裹结构。模板本身不会修改任何网页内容，默认只匹配 `https://example.com/*`，不能直接作为正式功能脚本安装。

## 使用方式

1. 复制 `templates/basic.user.js` 到对应的网站目录。
2. 修改 `@name`、`@namespace`、`@version`、`@description` 和 `@match`。
3. 按需增加 `@grant`、`@connect` 等权限声明。
4. 实现功能后，将正式脚本的 `@updateURL` 和 `@downloadURL` 指向 GitHub Raw 地址。
5. 在 `docs/scripts/` 创建同名说明文档，并在根 README 中加入安装入口。

## 注意事项

- 模板中的 `example.com` 只是占位匹配规则。
- 正式脚本应使用明确、最小的权限声明。
- 版本号应从正式发布版本开始递增，模板版本不代表任何实际脚本版本。
