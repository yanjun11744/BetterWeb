// ==UserScript==
// @name         JavLibrary 演员搜索 JavFree
// @namespace    betterweb-javlibrary-javfree-actor-search
// @version      1.0
// @description  在 JavLibrary 出演者后添加 JavFree 演员搜索按钮
// @match        https://www.javlibrary.com/*
// @match        http://www.javlibrary.com/*
// @grant        GM_openInTab
// @updateURL    https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/javlibrary/javfree-actor-search.user.js
// @downloadURL  https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/javlibrary/javfree-actor-search.user.js
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const actorLinks = [
        ...document.querySelectorAll('#video_cast .text a, #video_cast a')
    ];

    if (actorLinks.length === 0) {
        console.log('[JavFree Actor] 找不到出演者');
        return;
    }

    const uniqueLinks = [...new Set(actorLinks)];

    for (const actorLink of uniqueLinks) {
        const actorName = actorLink.textContent.trim();

        if (
            !actorName ||
            actorLink.nextElementSibling?.classList.contains(
                'javfree-actor-button'
            )
        ) {
            continue;
        }

        createSearchButton(actorLink, actorName);
    }

    function createSearchButton(actorLink, actorName) {
        const button = document.createElement('button');
        const icon = document.createElement('img');
        const searchURL =
            'https://javfree.me/?s=' + encodeURIComponent(actorName);

        button.className = 'javfree-actor-button';
        button.type = 'button';
        button.title = `在 JavFree 搜索演员：${actorName}`;
        button.setAttribute('aria-label', `在 JavFree 搜索演员 ${actorName}`);
        button.style.display = 'inline-flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.width = '22px';
        button.style.height = '22px';
        button.style.marginLeft = '4px';
        button.style.padding = '0';
        button.style.verticalAlign = 'middle';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.background = 'transparent';
        button.style.cursor = 'pointer';
        button.style.transition =
            'transform 0.15s ease, opacity 0.15s ease';

        icon.src = 'https://javfree.me/favicon.ico';
        icon.alt = 'JavFree';
        icon.style.width = '16px';
        icon.style.height = '16px';
        icon.style.display = 'block';
        icon.style.objectFit = 'contain';
        icon.draggable = false;

        button.appendChild(icon);
        actorLink.insertAdjacentElement('afterend', button);

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

            console.log('[JavFree Actor] 打开:', searchURL);
            GM_openInTab(searchURL, {
                active: true,
                insert: true,
                setParent: true
            });
        }, true);
    }
})();
