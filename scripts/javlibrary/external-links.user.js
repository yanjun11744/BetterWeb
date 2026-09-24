// ==UserScript==
// @name         JavLibrary 外部站点快捷按钮
// @namespace    betterweb-javlibrary-external-links
// @version      1.0
// @description  在 JavLibrary 番号旁添加 JavFree、Wuji 和 Jable 快捷按钮
// @match        https://www.javlibrary.com/*
// @match        http://www.javlibrary.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      javfree.me
// @updateURL    https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/javlibrary/external-links.user.js
// @downloadURL  https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/javlibrary/external-links.user.js
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const idElement = document.querySelector('#video_id .text');

    if (!idElement) {
        console.log('[BetterWeb] 找不到番号元素');
        return;
    }

    const code = idElement.textContent.trim();

    if (!code) {
        console.log('[BetterWeb] 番号为空');
        return;
    }

    if (document.querySelector('#betterweb-external-links')) {
        return;
    }

    const normalizedCode = code.toLowerCase();
    const services = [
        {
            id: 'javfree',
            name: 'JavFree',
            icon: 'https://javfree.me/favicon.ico',
            getURL: findJavFreeURL,
            fallbackURL: `https://javfree.me/?s=${encodeURIComponent(code)}`
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

    const container = document.createElement('span');
    container.id = 'betterweb-external-links';
    container.style.display = 'inline-flex';
    container.style.alignItems = 'center';

    idElement.appendChild(container);

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
        button.style.display = 'inline-flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.width = '22px';
        button.style.height = '22px';
        button.style.marginLeft = '6px';
        button.style.padding = '0';
        button.style.verticalAlign = 'middle';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.background = 'transparent';
        button.style.cursor = 'pointer';
        button.style.transition =
            'transform 0.15s ease, opacity 0.15s ease';

        icon.src = service.icon;
        icon.alt = service.name;
        icon.style.width = '16px';
        icon.style.height = '16px';
        icon.style.display = 'block';
        icon.style.objectFit = 'contain';
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

            console.log(`[BetterWeb] 打开 ${service.name}:`, targetURL);
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

    function findJavFreeURL(searchCode) {
        const searchURL =
            'https://javfree.me/?s=' + encodeURIComponent(searchCode);

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

                    resolve(match ? new URL(
                        match.getAttribute('href'),
                        'https://javfree.me'
                    ).href : null);
                },
                onerror() {
                    resolve(null);
                }
            });
        });
    }
})();
