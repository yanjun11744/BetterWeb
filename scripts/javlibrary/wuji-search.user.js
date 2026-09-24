// ==UserScript==
// @name         JavLibrary 番号搜索 Wuji
// @namespace    javlibrary-to-wuji
// @version      1.1
// @description  在 JavLibrary 番号旁添加 Wuji 搜索按钮
// @match        https://www.javlibrary.com/*
// @match        http://www.javlibrary.com/*
// @grant        GM_openInTab
// @updateURL    https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/javlibrary/wuji-search.user.js
// @downloadURL  https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/javlibrary/wuji-search.user.js
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const idElement = document.querySelector('#video_id .text');

    if (!idElement) {
        console.log('[Wuji] 找不到番号元素');
        return;
    }

    const code = idElement.textContent.trim();

    if (!code) {
        console.log('[Wuji] 番号为空');
        return;
    }

    console.log('[Wuji] 当前番号:', code);

    if (document.querySelector('#wuji-button')) {
        return;
    }

    const searchURL =
        'https://wuji.me/search?q=' +
        encodeURIComponent(code);

    const button = document.createElement('button');

    button.id = 'wuji-button';
    button.type = 'button';
    button.title = 'Search in Wuji';
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

    const icon = document.createElement('img');

    icon.src = 'https://wuji.me/favicon.ico';
    icon.alt = 'Wuji';
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
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        GM_openInTab(searchURL, {
            active: true,
            insert: true,
            setParent: true
        });
    }, true);
})();
