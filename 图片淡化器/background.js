// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';
chrome.runtime.onInstalled.addListener(function() {
    //设值
    chrome.storage.sync.set({
        'isOpen': false,
        'opacityValue': 8
    }, function() {});
    //页面激活规则
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher()],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});
//当tab被选中
chrome.tabs.onActivated.addListener(function(activeInfo) {
    updateImgs(activeInfo.tabId)
});
//当tab有更新
chrome.tabs.onUpdated.addListener(function(tabId, info) {
    updateImgs(tabId)
});
//接受消息通知
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.tabid) {
        updateImgs(request.tabid)
    }
});

function updateImgs(tabid) {
    chrome.tabs.get(tabid, function(t) {
        if (t.url.startsWith("http")) {
            chrome.storage.sync.get('isOpen', function(data) {
                if (data.isOpen) {
                    hiddenImgs(tabid)
                } else {
                    showImgs(tabid)
                }
            });
        }
    })
}

function hiddenImgs(tabid) {
    chrome.storage.sync.get('opacityValue', function(data) {
        let ov = (data.opacityValue || 8) / 100;
        chrome.tabs.executeScript(tabid, {
            //document.title2=document.title;document.title='hidde_title';
            code: "var dhq_imgs = document.getElementsByTagName('img'); function dhq_setOv1(x) { x.srcElement.style.opacity = '1' } function dhq_setOv2(x) { x.srcElement.style.opacity = '" + ov + "' } for (var i = 0; i < dhq_imgs.length; i++) { dhq_imgs[i].style.opacity = '" + ov + "'; dhq_imgs[i].removeEventListener('mouseover', dhq_setOv1); dhq_imgs[i].removeEventListener('mouseout', dhq_setOv2); dhq_imgs[i].addEventListener('mouseover', dhq_setOv1); dhq_imgs[i].addEventListener('mouseout', dhq_setOv2); }"
        });
    });
}

function showImgs(tabid) {
    chrome.tabs.executeScript(tabid, {
        //document.title=document.title2||document.title;
        code: "var dhq_imgs = document.getElementsByTagName('img'); for (var i = 0; i < dhq_imgs.length; i++) { dhq_imgs[i].removeEventListener('mouseover', dhq_setOv1); dhq_imgs[i].removeEventListener('mouseout', dhq_setOv2); dhq_imgs[i].style.opacity = '1'; }"
    });
}