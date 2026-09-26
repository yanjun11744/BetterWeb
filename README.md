# BetterWeb

> Small userscripts that make everyday websites better.

**BetterWeb** 是一个轻量的浏览器用户脚本集合，用于改善网站体验、减少重复操作，并给现有网页补充更顺手的功能。

无需 Node.js、npm 或构建工具。每个脚本都是可以直接安装到 Tampermonkey / Violentmonkey 的 `.user.js` 文件。

## 快速安装

以下链接会直接打开 Tampermonkey / Violentmonkey 的安装页面：

- [JavLibrary 外部站点快捷按钮](https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/javlibrary/external-links.user.js)
- [JavLibrary 演员搜索 JavFree](https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/javlibrary/javfree-actor-search.user.js)
- [JavLibrary 防广告跳转](https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/javlibrary/no-ad-redirect.user.js)
- [Wuji 搜索结果直接磁力](https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/wuji.me/magnet-in-search.user.js)

安装前请先安装 [Tampermonkey](https://www.tampermonkey.net/) 或 [Violentmonkey](https://violentmonkey.github.io/)。也可以打开脚本文件后点击 GitHub 页面上的 **Raw** 安装。

## 脚本目录

每个脚本都有独立的功能说明、适用页面、权限和已知限制：

| 脚本 | 说明 |
| --- | --- |
| [JavLibrary 外部站点快捷按钮](docs/scripts/external-links.md) | 在番号旁统一添加 JavFree、Wuji、Jable 三个按钮 |
| [JavLibrary 演员搜索 JavFree](docs/scripts/javfree-actor-search.md) | 在每位出演者后添加 JavFree 演员搜索按钮 |
| [JavLibrary 防广告跳转](docs/scripts/no-ad-redirect.md) | 拦截 JavLibrary 页面上的外部广告跳转和弹窗 |
| [Wuji 搜索结果直接磁力](docs/scripts/wuji-magnet-in-search.md) | 在搜索结果页直接提取、打开和复制磁力链接 |
| [基础模板](docs/scripts/basic-template.md) | 新增 BetterWeb 用户脚本时使用的元数据模板 |

脚本源文件仍集中在 [`scripts/`](scripts/) 目录中；文档目录只负责说明功能和维护方式。

## Scripts

### JavLibrary

#### External Links

文件：[`scripts/javlibrary/external-links.user.js`](scripts/javlibrary/external-links.user.js)

- 在番号旁固定显示 JavFree、Wuji、Jable 三个按钮
- 共享按钮样式和跳转逻辑
- JavFree 自动查找真实详情页
- [查看详细说明](docs/scripts/external-links.md)

#### JavFree Actor Search

文件：[`scripts/javlibrary/javfree-actor-search.user.js`](scripts/javlibrary/javfree-actor-search.user.js)

- 在每位出演者后添加 JavFree 搜索图标
- 点击后在新标签页打开演员搜索结果
- 支持用户脚本管理器自动更新
- [查看详细说明](docs/scripts/javfree-actor-search.md)

#### No Ad Redirect

文件：[`scripts/javlibrary/no-ad-redirect.user.js`](scripts/javlibrary/no-ad-redirect.user.js)

- 阻止 JavLibrary 常见外部广告跳转与弹窗
- JavLibrary 站内链接正常使用
- JavFree 跳转正常放行
- 与 JavFree 跳转脚本独立维护
- [查看详细说明](docs/scripts/no-ad-redirect.md)

### Wuji

#### Wuji 搜索结果直接磁力

文件：[`scripts/wuji.me/magnet-in-search.user.js`](scripts/wuji.me/magnet-in-search.user.js)

- 在 Wuji 搜索结果中自动识别资源详情页
- 直接提取磁力链接或根据 info hash 生成磁力链接
- 提供磁力链接打开和复制按钮
- 支持动态加载结果和最多 4 个并发请求
- [查看详细说明](docs/scripts/wuji-magnet-in-search.md)

## Project Structure

```text
BetterWeb/
├── scripts/
│   ├── javlibrary/
│   │   ├── external-links.user.js
│   │   ├── javfree-actor-search.user.js
│   │   └── no-ad-redirect.user.js
│   └── wuji.me/
│       └── magnet-in-search.user.js
├── templates/
│   └── basic.user.js
├── docs/
│   └── scripts/
│       ├── basic-template.md
│       ├── external-links.md
│       ├── javfree-actor-search.md
│       ├── no-ad-redirect.md
│       └── wuji-magnet-in-search.md
├── .gitignore
├── LICENSE
└── README.md
```

## Install

1. 安装 Tampermonkey 或 Violentmonkey。
2. 点击上方的直接安装链接，或在 GitHub 中打开需要安装的 `.user.js` 文件。
3. 如果打开的是 GitHub 文件页，点击 **Raw**。
4. 用户脚本管理器会识别脚本并显示安装页面。
5. 确认安装并启用脚本。

## Automatic Updates

### 用户端自动更新

每个正式脚本的元数据区都配置了 `@updateURL` 和 `@downloadURL`，指向 GitHub Raw 文件：

```text
https://github.com/yanjun11744/BetterWeb
```

管理器会定期访问 `@updateURL`，读取脚本头部的 `@version`。当远程版本高于本地版本时，管理器会提示或自动下载新版本，具体频率和是否自动安装取决于管理器设置。

在 Tampermonkey 中可以通过“已安装脚本 → 设置 → 更新间隔”调整检查频率，也可以使用“检查更新”立即检查。Violentmonkey 的入口通常位于脚本详情页或扩展设置中的“检查更新”。

注意：浏览器缓存、网络访问 GitHub Raw 失败，或脚本管理器禁用了自动更新，都可能导致更新延迟。手动打开上方 Raw 链接可以确认远程文件是否已更新。

### 发布新版本

维护者修改脚本后，必须同步提高对应脚本头部的 `@version`：

```javascript
// @version      1.4
```

例如：

```text
1.3 → 1.4 → 1.5
```

推荐使用递增的版本号，例如 `1.3 → 1.4 → 1.5`。修改完成后按以下顺序发布：

```bash
git diff --check
git add scripts/ docs/ README.md
git commit -m "Update userscript"
git push origin main
```

推送完成后，等待 GitHub Raw 内容可访问，再在 Tampermonkey / Violentmonkey 中手动检查更新。不要只修改 README；用户脚本管理器只会根据脚本元数据和 Raw 文件判断是否有新版本。

### 新增脚本时的更新配置

正式脚本至少应包含以下元数据，并将路径替换成实际文件路径：

```javascript
// @version      1.0.0
// @updateURL    https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/<site>/<script>.user.js
// @downloadURL  https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/<site>/<script>.user.js
```

`@version` 必须位于用户脚本元数据区内，并且每次可下载内容发生变化时递增。新增脚本后，还要在 `docs/scripts/` 增加对应说明，并把安装链接加入本 README。

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

提交前可运行 `git diff --check` 检查空白字符问题，并确认脚本头部的 `@match`、`@grant`、`@connect` 和版本号与实际代码一致。

## License

MIT
