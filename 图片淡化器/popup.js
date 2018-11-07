// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';
// let changeColor = document.getElementById('changeColor');
// chrome.storage.sync.get('color', function(data) {
//   changeColor.style.backgroundColor = data.color;
//   changeColor.setAttribute('value', data.color);
// });
// changeColor.onclick = function(element) {
//   let color = element.target.value;
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.executeScript(
//         tabs[0].id,
//         {code: "var imgs = document.getElementsByTagName('img'); for(var i=0; i<imgs.length; i++){imgs[i].style.opacity='0.08';imgs[i].addEventListener('mouseover', function(x){x.srcElement.style.opacity='1'});imgs[i].addEventListener('mouseout', function(x){x.srcElement.style.opacity='0.08'})}"});
//   });
// };
let switchBtn = document.getElementById('switch_btn');
let ovSlider = document.getElementById('ov');

//同步状态
chrome.storage.sync.get('isOpen', function(data) {
    if (data.isOpen) {
        switchBtn.checked = true;
    	ovSlider.removeAttribute('disabled');
    }else{
        ovSlider.setAttribute('disabled', 'disabled');
    }
});

//同步透明值
chrome.storage.sync.get('opacityValue', function(data) {
    ovSlider.value=data.opacityValue;
});

switchBtn.onclick = function(ele) {
    chrome.storage.sync.set({
        'isOpen': switchBtn.checked
    }, function() {});
    if(switchBtn.checked) {
    	ovSlider.removeAttribute('disabled');
    }else{
    	ovSlider.setAttribute('disabled', 'disabled');
    }
    publishUpdateEvent();
}

ovSlider.addEventListener("change", function(ele){
    chrome.storage.sync.set({
        'opacityValue': ovSlider.value
    }, function() {});
    publishUpdateEvent();
})

function publishUpdateEvent(){
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        chrome.runtime.sendMessage({
            tabid: tabs[0].id
        }, function(response) {});
    });
}