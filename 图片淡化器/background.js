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
    try{
        chrome.tabs.get(tabid, function(t) {
            if (t.url && t.url.startsWith("http")) {
                chrome.storage.sync.get('isOpen', function(data) {
                    if (data.isOpen) {
                        showImgs(tabid)
                        hiddenImgs(tabid)
                    } else {
                        showImgs(tabid)
                    }
                });
            }
        })
    }catch(err){
    }
}

function hiddenImgs(tabid) {
    chrome.storage.sync.get('opacityValue', function(data) {
        let ov = (data.opacityValue || 8) / 100;
        executeScript(tabid, "var s = document.createElement('style');s.id='dhq_style';s.innerHTML='img{opacity:"+ov+" !important}img:hover{opacity:1 !important}';document.head.appendChild(s);")
    });
}

function showImgs(tabid) {
    executeScript(tabid, "var dhq_s = document.getElementById('dhq_style');if(dhq_s)document.head.removeChild(dhq_s);")
}

function executeScript(tabid, script){
    try{
        chrome.tabs.executeScript(tabid, {
            code: script
        });
    }catch(err){}
}