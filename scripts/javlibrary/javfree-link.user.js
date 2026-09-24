// ==UserScript==
// @name         JavLibrary 番号跳转 JavFree
// @namespace    javlibrary-to-javfree
// @version      1.5
// @description  在 JavLibrary 番号旁添加 JavFree 按钮，点击跳转到对应详情页
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
        console.log('[JavFree] 找不到番号元素');
        return;
    }

    const code = idElement.textContent.trim();
    if (!code) {
        console.log('[JavFree] 番号为空');
        return;
    }

    console.log('[JavFree] 当前番号:', code);

    if (document.querySelector('#javfree-button')) {
        return;
    }

    const searchURL =
        'https://javfree.me/?s=' + encodeURIComponent(code);
    const button = document.createElement('a');

    button.id = 'javfree-button';
    button.href = searchURL;
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    button.title = 'Open in JavFree';
    button.style.display = 'inline-flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.width = '22px';
    button.style.height = '22px';
    button.style.marginLeft = '6px';
    button.style.verticalAlign = 'middle';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.transition =
        'transform 0.15s ease, opacity 0.15s ease';

    const icon = document.createElement('img');
    icon.src = 'https://javfree.me/favicon.ico';
    icon.alt = 'JavFree';
    icon.style.width = '16px';
    icon.style.height = '16px';
    icon.style.display = 'block';
    icon.style.objectFit = 'contain';
    icon.draggable = false;
    button.appendChild(icon);
    idElement.appendChild(button);

    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.12)';
        button.style.opacity = '0.8';
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
        button.style.opacity = '1';
    });

    button.addEventListener('click', event => {
        event.stopPropagation();
        event.stopImmediatePropagation();
    }, true);

    findJavFreeURL(code).then(url => {
        if (!url) {
            console.log(
                '[JavFree] 未找到详情页，使用搜索页面:',
                searchURL
            );
            return;
        }

        console.log('[JavFree] 找到详情页:', url);
        button.href = url;
    });

    function findJavFreeURL(code) {
        return new Promise(resolve => {
            const searchURL =
                'https://javfree.me/?s=' + encodeURIComponent(code);

            console.log('[JavFree] 搜索:', searchURL);

            GM_xmlhttpRequest({
                method: 'GET',
                url: searchURL,
                onload(response) {
                    console.log('[JavFree] HTTP:', response.status);

                    const parser = new DOMParser();
                    const doc = parser.parseFromString(
                        response.responseText,
                        'text/html'
                    );
                    const normalizedCode = code
                        .trim()
                        .toLowerCase()
                        .replace(/\s+/g, '');
                    const links = [...doc.querySelectorAll('a[href]')];
                    const match = links.find(link => {
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
                                path.endsWith('/' + normalizedCode) &&
                                /^\/\d+\//.test(path)
                            );
                        } catch {
                            return false;
                        }
                    });

                    if (!match) {
                        console.log(
                            '[JavFree] 搜索结果中没有找到:',
                            code
                        );
                        resolve(null);
                        return;
                    }

                    resolve(new URL(
                        match.getAttribute('href'),
                        'https://javfree.me'
                    ).href);
                },
                onerror(error) {
                    console.error('[JavFree] 请求失败:', error);
                    resolve(null);
                }
            });
        });
    }
})();
