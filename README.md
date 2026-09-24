# BetterWeb

> Small userscripts that make everyday websites better.

**BetterWeb** 是一个轻量的浏览器用户脚本集合，用于改善网站体验、减少重复操作，并给现有网页补充更顺手的功能。

无需 Node.js、npm 或构建工具。每个脚本都是可以直接安装到 Tampermonkey / Violentmonkey 的 `.user.js` 文件。

## Scripts

### JavLibrary

#### JavLibrary → JavFree

文件：[`scripts/javlibrary/javfree-link.user.js`](scripts/javlibrary/javfree-link.user.js)

- 在 JavLibrary 详情页把番号变成可点击链接
- 自动查询对应的 JavFree 详情页
- 在新标签页打开
- 当前稳定版本：`1.3`
- 保留已经验证可用的 DOM 与点击逻辑

#### No Ad Redirect

文件：[`scripts/javlibrary/no-ad-redirect.user.js`](scripts/javlibrary/no-ad-redirect.user.js)

- 阻止 JavLibrary 常见外部广告跳转与弹窗
- JavLibrary 站内链接正常使用
- JavFree 跳转正常放行
- 与 JavFree 跳转脚本独立维护

## Project Structure

```text
BetterWeb/
├── scripts/
│   └── javlibrary/
│       ├── javfree-link.user.js
│       └── no-ad-redirect.user.js
├── templates/
│   └── basic.user.js
├── .gitignore
├── LICENSE
└── README.md
```

## Install

1. 安装 Tampermonkey 或 Violentmonkey。
2. 在 GitHub 中打开需要安装的 `.user.js` 文件。
3. 点击 **Raw**。
4. 用户脚本管理器会识别脚本并显示安装页面。
5. 确认安装。

## Automatic Updates

当前脚本已经指向公开仓库：

```text
https://github.com/yanjun11744/BetterWeb
```

每个脚本都配置了 `@updateURL` 和 `@downloadURL`。

以后发布新版本时，除了修改代码，还要提高：

```javascript
// @version      1.4
```

例如：

```text
1.3 → 1.4 → 1.5
```

提交并 push 到 `main` 后，Tampermonkey 可以通过 GitHub Raw 地址检查新版本。

## Adding Scripts

推荐一个网站一个目录，一个功能一个脚本：

```text
scripts/
├── javlibrary/
├── github/
├── youtube/
└── example-site/
```

不要把互不相关的功能合并到同一个 userscript 中。

## Development

BetterWeb 不需要构建步骤，直接编辑 `.user.js` 即可。

建议每次确认稳定版本后提交 Git：

```bash
git add .
git commit -m "Update userscript"
git push
```

## License

MIT
