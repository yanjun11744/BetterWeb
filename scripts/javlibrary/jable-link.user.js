// ==UserScript==
// @name         JavLibrary 番号跳转 Jable
// @namespace    javlibrary-to-jable
// @version      1.0
// @description  在 JavLibrary 番号旁添加 Jable 按钮，点击直接打开对应视频页面
// @match        https://www.javlibrary.com/*
// @match        http://www.javlibrary.com/*
// @grant        GM_openInTab
// @updateURL    https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/javlibrary/jable-link.user.js
// @downloadURL  https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/javlibrary/jable-link.user.js
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const idElement = document.querySelector('#video_id .text');
    if (!idElement) {
        console.log('[Jable] 找不到番号元素');
        return;
    }

    const code = idElement.textContent.trim();
    if (!code) {
        console.log('[Jable] 番号为空');
        return;
    }

    console.log('[Jable] 当前番号:', code);

    if (document.querySelector('#jable-button')) {
        return;
    }

    const normalizedCode = code.trim().toLowerCase();
    const jableURL =
        'https://jable.tv/videos/' +
        encodeURIComponent(normalizedCode) + '/';

    const button = document.createElement('button');
    button.id = 'jable-button';
    button.type = 'button';
    button.title = 'Open in Jable';
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
    icon.src = 'https://jable.tv/favicon.ico';
    icon.alt = 'Jable';
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
        console.log('[Jable] 打开:', jableURL);

        GM_openInTab(jableURL, {
            active: true,
            insert: true,
            setParent: true
        });
    }, true);
})();
