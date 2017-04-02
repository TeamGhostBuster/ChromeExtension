'use strict';

console.log('This is the Event Page for Browser Action');

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

// chrome.browserAction.setBadgeText({text: 'CL'});
