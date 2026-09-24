// ==UserScript==
// @name         JavLibrary 番号跳转 JavFree
// @namespace    javlibrary-to-javfree
// @version      1.3
// @description  点击 JavLibrary 番号，在新标签页打开 JavFree 对应详情页
// @match        https://www.javlibrary.com/*
// @match        http://www.javlibrary.com/*
// @grant        GM_xmlhttpRequest
// @connect      javfree.me
// @updateURL    https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/javlibrary/javfree-link.user.js
// @downloadURL  https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/javlibrary/javfree-link.user.js
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const idElement = document.querySelector('#video_id .text');

    if (!idElement) {
        return;
    }

    const code = idElement.textContent.trim();

    if (!code) {
        return;
    }

    findJavFreeURL(code).then(url => {
        if (!url) {
            console.log('[JavFree] 未找到:', code);
            return;
        }

        createLink(url);
    });

    function createLink(url) {
        idElement.textContent = '';

        const link = document.createElement('a');

        link.textContent = code;
        link.href = url;

        // 关键：浏览器原生新标签页
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        link.style.color = 'inherit';
        link.style.textDecoration = 'underline';
        link.style.cursor = 'pointer';

        link.addEventListener('click', event => {

            // 不要 preventDefault()
            // 让浏览器正常处理 href + target="_blank"

            // 只阻止 JavLibrary 的广告点击事件继续处理
            event.stopPropagation();
            event.stopImmediatePropagation();

        }, true);

        const arrow = document.createElement('span');

        arrow.textContent = ' ↗';
        arrow.style.opacity = '0.65';
        arrow.style.marginLeft = '2px';
        arrow.style.userSelect = 'none';

        idElement.appendChild(link);
        idElement.appendChild(arrow);
    }

    function findJavFreeURL(code) {
        return new Promise(resolve => {

            const searchURL =
                'https://javfree.me/?s=' +
                encodeURIComponent(code);

            GM_xmlhttpRequest({
                method: 'GET',
                url: searchURL,

                onload(response) {

                    const parser = new DOMParser();

                    const doc = parser.parseFromString(
                        response.responseText,
                        'text/html'
                    );

                    const normalizedCode =
                        code
                            .trim()
                            .toLowerCase()
                            .replace(/\s+/g, '');

                    const links = [
                        ...doc.querySelectorAll('a[href]')
                    ];

                    const match = links.find(link => {
                        try {
                            const url = new URL(
                                link.getAttribute('href'),
                                'https://javfree.me'
                            );

                            const path =
                                url.pathname
                                    .toLowerCase()
                                    .replace(/\/+$/, '');

                            return (
                                url.hostname.endsWith('javfree.me') &&
                                path.endsWith('/' + normalizedCode) &&
                                /^\/\d+\//.test(path)
                            );

                        } catch {
                            return false;
                        }
                    });

                    if (!match) {
                        resolve(null);
                        return;
                    }

                    resolve(
                        new URL(
                            match.getAttribute('href'),
                            'https://javfree.me'
                        ).href
                    );
                },

                onerror() {
                    resolve(null);
                }
            });
        });
    }
})();
