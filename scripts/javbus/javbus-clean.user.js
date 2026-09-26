// ==UserScript==
// @name         JavBus 去广告
// @namespace    javbus-clean
// @version      2.0
// @description  清除 JavBus 首页、列表页和详情页广告
// @match        https://*.javbus.com/*
// @match        http://*.javbus.com/*
// @match        https://javbus.com/*
// @match        http://javbus.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/javbus/javbus-clean.user.js
// @downloadURL  https://raw.githubusercontent.com/yanjun11744/BetterWeb/main/scripts/javbus/javbus-clean.user.js
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const selectors = [
        '.ad-box',
        '.ad-item',
        '.ad-juicy',
        '.banner728',
        '.banner300',
        '.bcpic2',
        '#bob',
        '#tb'
    ];

    const adSelector = selectors.join(',');
    const style = document.createElement('style');

    style.textContent = `
        ${adSelector} {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
        }

        .row iframe {
            display: none !important;
        }
    `;

    (document.head || document.documentElement).appendChild(style);

    function removeAds() {
        document.querySelectorAll(adSelector).forEach(element => {
            element.remove();
        });

        document.querySelectorAll('.row iframe').forEach(element => {
            element.remove();
        });

        document.querySelectorAll(
            'script[src*="jads.co"], ' +
            'script[src*="juicyads"], ' +
            'iframe[src*="jads"], ' +
            'iframe[src*="juicyads"]'
        ).forEach(element => {
            element.remove();
        });

        document.querySelectorAll('img[src*="/ads/"]').forEach(image => {
            const container =
                image.closest('.ad-item') ||
                image.closest('a') ||
                image;

            container.remove();
        });
    }

    removeAds();

    const observer = new MutationObserver(removeAds);

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
