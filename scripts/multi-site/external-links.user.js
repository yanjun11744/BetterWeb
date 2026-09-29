// ==UserScript==
// @name         BetterWeb 多站点外部快捷按钮
// @namespace    betterweb-javlibrary-external-links
// @version      1.4
// @description  在 JavLibrary、JavBus、JavFree 的番号旁添加外部快捷按钮
// @match        https://www.javlibrary.com/*
// @match        http://www.javlibrary.com/*
// @match        https://*.javbus.com/*
// @match        http://*.javbus.com/*
// @match        https://javbus.com/*
// @match        http://javbus.com/*
// @match        https://javfree.me/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      javfree.me
// @updateURL    https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/multi-site/external-links.user.js
// @downloadURL  https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/multi-site/external-links.user.js
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const identifier = findIdentifier();

    if (!identifier) {
        console.log('[BetterWeb] 找不到番号字段');
        return;
    }

    const {
        code,
        mountPoint,
        insertBefore = null,
        site
    } = identifier;

    if (!code) {
        console.log('[BetterWeb] 番号为空');
        return;
    }

    if (document.querySelector('#betterweb-external-links')) {
        return;
    }

    const normalizedCode = code.toLowerCase();

    // 所有可用服务
    const allServices = [
        {
            id: 'javfree',
            name: 'JavFree',
            icon: 'https://javfree.me/favicon.ico',
            getURL: findJavFreeURL,
            fallbackURL:
                `https://javfree.me/?s=${encodeURIComponent(code)}`
        },
        {
            id: 'wuji',
            name: 'Wuji',
            icon: 'https://wuji.me/favicon.ico',
            getURL: () => Promise.resolve(
                `https://wuji.me/search?q=${encodeURIComponent(code)}`
            )
        },
        {
            id: 'jable',
            name: 'Jable',
            icon: 'https://jable.tv/favicon.ico',
            getURL: () => Promise.resolve(
                `https://jable.tv/videos/${encodeURIComponent(normalizedCode)}/`
            )
        }
    ];

    // JavFree 自己的页面不显示 JavFree 按钮
    const services = site === 'javfree'
        ? allServices.filter(service => service.id !== 'javfree')
        : allServices;

    const container = document.createElement('span');

    container.id = 'betterweb-external-links';
    container.style.display = 'inline-flex';
    container.style.alignItems = 'center';
    container.style.verticalAlign = 'middle';

    if (insertBefore) {
        mountPoint.insertBefore(container, insertBefore);
    } else {
        mountPoint.appendChild(container);
    }

    for (const service of services) {
        createServiceButton(service);
    }

    function createServiceButton(service) {
        const button = document.createElement('button');
        const icon = document.createElement('img');

        let targetURL = service.fallbackURL ?? null;

        button.id = `betterweb-${service.id}-button`;
        button.type = 'button';
        button.title = `Open in ${service.name}`;

        Object.assign(button.style, {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '22px',
            height: '22px',
            marginLeft: '6px',
            padding: '0',
            verticalAlign: 'middle',
            border: 'none',
            borderRadius: '5px',
            background: 'transparent',
            cursor: 'pointer',
            transition: 'transform 0.15s ease, opacity 0.15s ease'
        });

        icon.src = service.icon;
        icon.alt = service.name;

        Object.assign(icon.style, {
            width: '16px',
            height: '16px',
            display: 'block',
            objectFit: 'contain'
        });

        icon.draggable = false;

        button.appendChild(icon);
        container.appendChild(button);

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.12)';
            button.style.opacity = '0.8';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.opacity = '1';
        });

        button.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            if (!targetURL) {
                return;
            }

            console.log(
                `[BetterWeb] 打开 ${service.name}:`,
                targetURL
            );

            GM_openInTab(targetURL, {
                active: true,
                insert: true,
                setParent: true
            });
        }, true);

        service.getURL(code).then(url => {
            if (url) {
                targetURL = url;
            }
        });
    }

    // MARK: - JavFree

    function findJavFreeURL(searchCode) {
        const searchURL =
            'https://javfree.me/?s=' +
            encodeURIComponent(searchCode);

        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: searchURL,

                onload(response) {
                    const parser = new DOMParser();

                    const doc = parser.parseFromString(
                        response.responseText,
                        'text/html'
                    );

                    const normalized = searchCode
                        .trim()
                        .toLowerCase()
                        .replace(/\s+/g, '');

                    const match = [...doc.querySelectorAll('a[href]')]
                        .find(link => {
                            try {
                                const url = new URL(
                                    link.getAttribute('href'),
                                    'https://javfree.me'
                                );

                                const path = url.pathname
                                    .toLowerCase()
                                    .replace(/\/+$/, '');

                                return (
                                    url.hostname.endsWith('javfree.me') &&
                                    path.endsWith('/' + normalized) &&
                                    /^\/\d+\//.test(path)
                                );
                            } catch {
                                return false;
                            }
                        });

                    resolve(
                        match
                            ? new URL(
                                match.getAttribute('href'),
                                'https://javfree.me'
                            ).href
                            : null
                    );
                },

                onerror() {
                    resolve(null);
                }
            });
        });
    }

    // MARK: - Site adapters

    function findIdentifier() {
        const adapters = [
            {
                site: 'javlibrary',
                matches: hostname =>
                    /javlibrary\.com$/i.test(hostname),
                findIdentifier: findJavLibraryIdentifier
            },
            {
                site: 'javbus',
                matches: hostname =>
                    /javbus\.com$/i.test(hostname),
                findIdentifier: findJavBusIdentifier
            },
            {
                site: 'javfree',
                matches: hostname =>
                    /javfree\.me$/i.test(hostname),
                findIdentifier: findJavFreeIdentifier
            }
        ];

        const adapter = adapters.find(({ matches }) =>
            matches(location.hostname)
        );

        if (!adapter) {
            return null;
        }

        const result = adapter.findIdentifier();

        if (!result) {
            return null;
        }

        return {
            ...result,
            site: adapter.site
        };
    }

    // MARK: - JavLibrary

    function findJavLibraryIdentifier() {
        const element =
            document.querySelector('#video_id .text');

        const code = element?.textContent.trim();

        return element && code
            ? {
                code,
                mountPoint: element
            }
            : null;
    }

    // MARK: - JavBus

    function findJavBusIdentifier() {
        const info =
            document.querySelector('.container .info') ||
            document.querySelector('.info');

        if (!info) {
            return null;
        }

        const headers = [...info.querySelectorAll('.header')];

        const header = headers.find(element =>
            /^(識別碼|识别码|ID|品番)\s*[:：]?$/i.test(
                element.textContent.trim()
            )
        );

        if (!header) {
            return null;
        }

        const row =
            header.closest('p') ||
            header.parentElement;

        if (!row) {
            return null;
        }

        const rowText = row.textContent
            .replace(header.textContent, '')
            .trim();

        const code =
            rowText.match(
                /[A-Z0-9][A-Z0-9._-]*/i
            )?.[0];

        return code
            ? {
                code,
                mountPoint: row
            }
            : null;
    }

    // MARK: - JavFree

    function findJavFreeIdentifier() {
        /*
         JavFree 详情页例如：

         https://javfree.me/450054/ofje-320

         页面显示：

         品番： ofje00320

         但真正适合 Wuji / Jable 搜索的番号是：

         OFJE-320
        */

        const code = getJavFreeCodeFromURL();

        if (!code) {
            return null;
        }

        // 查找包含“品番：”的文字节点
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT
        );

        let node;

        while ((node = walker.nextNode())) {
            const text = node.textContent?.trim();

            if (!text) {
                continue;
            }

            if (!/^品番\s*[:：]/i.test(text)) {
                continue;
            }

            const parent = node.parentElement;

            if (!parent) {
                continue;
            }

            /*
             尽量找到品番所在的行。
             常见形式：

             <p>
                 品番： <strong>ofje00320</strong>
                 <br>
             </p>
            */

            const row =
                parent.closest('p') ||
                parent.closest('blockquote') ||
                parent;

            // 如果这一行存在 <br>，按钮插到第一个 br 前面
            const firstBreak =
                row.querySelector('br');

            return {
                code,
                mountPoint: row,
                insertBefore: firstBreak
            };
        }

        return null;
    }

    function getJavFreeCodeFromURL() {
        const parts = location.pathname
            .split('/')
            .filter(Boolean);

        /*
         /450054/ofje-320

         parts:
         [
             "450054",
             "ofje-320"
         ]
        */

        if (parts.length < 2) {
            return null;
        }

        const slug = parts.at(-1);

        if (!slug) {
            return null;
        }

        // 必须看起来像番号
        if (!/[a-z]/i.test(slug) || !/\d/.test(slug)) {
            return null;
        }

        return slug.toUpperCase();
    }
})();