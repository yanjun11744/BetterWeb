// ==UserScript==
// @name         Wuji 搜索结果直接磁力
// @namespace    wuji-magnet-in-search
// @version      1.0
// @description  在 Wuji 搜索结果列表直接获取磁力链接，并提供复制按钮，无需进入详情页
// @match        https://wuji.me/search*
// @match        https://www.wuji.me/search*
// @grant        GM_setClipboard
// @updateURL    https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/wuji.me/magnet-in-search.user.js
// @downloadURL  https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/wuji.me/magnet-in-search.user.js
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const MAX_CONCURRENT_REQUESTS = 4;

    const queue = [];
    let activeRequests = 0;

    // ==========================================
    // 样式
    // ==========================================

    const style = document.createElement('style');

    style.textContent = `
        .betterweb-magnet-tools {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-left: 10px;
            vertical-align: middle;
            font-size: 12px;
        }

        .betterweb-magnet-loading {
            opacity: 0.5;
            font-size: 12px;
        }

        .betterweb-magnet-link {
            display: inline-flex;
            align-items: center;
            padding: 2px 7px;

            border-radius: 5px;

            text-decoration: none !important;
            font-size: 12px;
            line-height: 18px;

            cursor: pointer;

            background: rgba(128, 128, 128, 0.12);

            transition:
                background 0.15s ease,
                transform 0.15s ease;
        }

        .betterweb-magnet-link:hover {
            background: rgba(128, 128, 128, 0.20);
            transform: scale(1.03);
        }

        .betterweb-magnet-copy {
            display: inline-flex;
            align-items: center;
            justify-content: center;

            padding: 2px 7px;

            border: none;
            border-radius: 5px;

            font: inherit;
            font-size: 12px;
            line-height: 18px;

            background: rgba(128, 128, 128, 0.12);

            cursor: pointer;

            transition:
                background 0.15s ease,
                transform 0.15s ease;
        }

        .betterweb-magnet-copy:hover {
            background: rgba(128, 128, 128, 0.20);
            transform: scale(1.03);
        }

        .betterweb-magnet-copy.copied {
            opacity: 0.65;
        }

        .betterweb-magnet-error {
            font-size: 12px;
            opacity: 0.5;
        }
    `;

    document.head.appendChild(style);


    // ==========================================
    // 扫描搜索结果
    // ==========================================

    scanResults();


    // 如果 Wuji 后续动态刷新列表，也自动处理
    const observer = new MutationObserver(() => {
        scanResults();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });


    // ==========================================
    // 查找详情页链接
    // ==========================================

    function scanResults() {

        const links = [
            ...document.querySelectorAll('a[href]')
        ];

        for (const link of links) {

            if (
                link.dataset.betterwebMagnetProcessed === 'true'
            ) {
                continue;
            }

            let url;

            try {
                url = new URL(
                    link.getAttribute('href'),
                    location.href
                );
            } catch {
                continue;
            }

            // Wuji 当前资源详情页类似：
            //
            // https://wuji.me/!lUL0
            //
            // 这里只处理这种详情链接
            if (
                url.hostname !== 'wuji.me' &&
                url.hostname !== 'www.wuji.me'
            ) {
                continue;
            }

            if (!/^\/![^/]+\/?$/.test(url.pathname)) {
                continue;
            }

            link.dataset.betterwebMagnetProcessed = 'true';

            createPlaceholder(link, url.href);
        }
    }


    // ==========================================
    // 创建占位
    // ==========================================

    function createPlaceholder(link, detailURL) {

        const container =
            document.createElement('span');

        container.className =
            'betterweb-magnet-tools';

        const loading =
            document.createElement('span');

        loading.className =
            'betterweb-magnet-loading';

        loading.textContent = '获取磁力…';

        container.appendChild(loading);

        // 放在结果标题后面
        link.insertAdjacentElement(
            'afterend',
            container
        );

        enqueue({
            detailURL,
            container
        });
    }


    // ==========================================
    // 请求队列
    // ==========================================

    function enqueue(job) {
        queue.push(job);
        processQueue();
    }


    function processQueue() {

        while (
            activeRequests <
                MAX_CONCURRENT_REQUESTS &&
            queue.length > 0
        ) {

            const job =
                queue.shift();

            activeRequests++;

            loadMagnet(
                job.detailURL
            )
                .then(magnet => {

                    if (magnet) {
                        renderMagnet(
                            job.container,
                            magnet
                        );
                    } else {
                        renderError(
                            job.container,
                            job.detailURL
                        );
                    }

                })
                .catch(error => {

                    console.error(
                        '[Wuji Magnet] 获取失败:',
                        job.detailURL,
                        error
                    );

                    renderError(
                        job.container,
                        job.detailURL
                    );

                })
                .finally(() => {

                    activeRequests--;

                    processQueue();

                });
        }
    }


    // ==========================================
    // 获取详情页磁力
    // ==========================================

    async function loadMagnet(detailURL) {

        console.log(
            '[Wuji Magnet] 获取:',
            detailURL
        );

        const response =
            await fetch(
                detailURL,
                {
                    credentials: 'same-origin'
                }
            );

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const html =
            await response.text();

        const parser =
            new DOMParser();

        const doc =
            parser.parseFromString(
                html,
                'text/html'
            );


        // ======================================
        // 情况 1：
        // 页面本身直接存在 magnet input
        // ======================================

        const magnetInput =
            doc.querySelector(
                'input[value^="magnet:?"]'
            );

        if (magnetInput) {

            const magnet =
                magnetInput.value.trim();

            if (magnet) {
                return magnet;
            }
        }


        // ======================================
        // 情况 2：
        // 页面存在 magnet 链接
        // ======================================

        const magnetLink =
            doc.querySelector(
                'a[href^="magnet:?"]'
            );

        if (magnetLink) {

            const magnet =
                magnetLink.getAttribute('href');

            if (magnet) {
                return magnet.trim();
            }
        }


        // ======================================
        // 情况 3：
        // 从「种子特征码」获取 info hash
        // ======================================

        const text =
            doc.body?.textContent ?? '';

        const hashMatch =
            text.match(
                /(?:种子特征码|特征码|info\s*hash|infohash|hash)[\s:：]*([a-fA-F0-9]{40}|[A-Z2-7]{32})/i
            );

        if (!hashMatch) {

            console.warn(
                '[Wuji Magnet] 未找到种子特征码:',
                detailURL
            );

            return null;
        }

        const hash =
            hashMatch[1];

        return (
            'magnet:?xt=urn:btih:' +
            hash
        );
    }


    // ==========================================
    // 显示磁力链接
    // ==========================================

    function renderMagnet(
        container,
        magnet
    ) {

        container.textContent = '';


        // ======================================
        // 磁力链接
        // ======================================

        const magnetLink =
            document.createElement('a');

        magnetLink.className =
            'betterweb-magnet-link';

        magnetLink.href = magnet;

        magnetLink.textContent =
            '磁力链接';

        magnetLink.title = magnet;


        // ======================================
        // 复制按钮
        // ======================================

        const copyButton =
            document.createElement(
                'button'
            );

        copyButton.type = 'button';

        copyButton.className =
            'betterweb-magnet-copy';

        copyButton.textContent =
            '复制';


        copyButton.addEventListener(
            'click',
            event => {

                event.preventDefault();
                event.stopPropagation();

                GM_setClipboard(
                    magnet,
                    'text'
                );

                copyButton.textContent =
                    '已复制';

                copyButton.classList.add(
                    'copied'
                );

                setTimeout(() => {

                    copyButton.textContent =
                        '复制';

                    copyButton.classList.remove(
                        'copied'
                    );

                }, 1200);
            }
        );


        container.appendChild(
            magnetLink
        );

        container.appendChild(
            copyButton
        );
    }


    // ==========================================
    // 获取失败
    // ==========================================

    function renderError(
        container,
        detailURL
    ) {

        container.textContent = '';

        const error =
            document.createElement('span');

        error.className =
            'betterweb-magnet-error';

        error.textContent =
            '磁力获取失败';

        error.title =
            detailURL;

        container.appendChild(
            error
        );
    }

})();
