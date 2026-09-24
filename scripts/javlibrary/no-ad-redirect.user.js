// ==UserScript==
// @name         JavLibrary 防广告跳转
// @namespace    javlibrary-no-ad-redirect
// @version      1.1
// @description  阻止 JavLibrary 广告弹窗和广告跳转，同时允许 JavFree
// @match        https://www.javlibrary.com/*
// @match        http://www.javlibrary.com/*
// @updateURL    https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/javlibrary/no-ad-redirect.user.js
// @downloadURL  https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/javlibrary/no-ad-redirect.user.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const allowedHosts = [
        'javlibrary.com',
        'www.javlibrary.com',
        'javfree.me',
        'www.javfree.me'
    ];

    function isAllowedURL(url) {
        try {
            const parsed = new URL(url, location.href);

            if (
                parsed.protocol !== 'http:' &&
                parsed.protocol !== 'https:'
            ) {
                return false;
            }

            return allowedHosts.some(host =>
                parsed.hostname === host ||
                parsed.hostname.endsWith('.' + host)
            );
        } catch {
            return false;
        }
    }

    const originalOpen = window.open;

    window.open = function (url, target, features) {
        if (!url) {
            return null;
        }

        const absoluteURL = new URL(url, location.href).href;

        if (!isAllowedURL(absoluteURL)) {
            console.log(
                '[JavLibrary Anti-Ad] Blocked window.open:',
                absoluteURL
            );

            return null;
        }

        return originalOpen.call(
            window,
            absoluteURL,
            target,
            features
        );
    };

    document.addEventListener(
        'click',
        event => {
            const link = event.target.closest('a');

            if (!link || !link.href) {
                return;
            }

            if (!isAllowedURL(link.href)) {
                console.log(
                    '[JavLibrary Anti-Ad] Blocked link:',
                    link.href
                );

                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            }
        },
        true
    );
})();
