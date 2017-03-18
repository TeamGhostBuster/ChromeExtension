'use strict';

console.log('This is the Popup');



function callback(error, httpStatus, responseText) {
  console.log('Response after authenticatedXhr to get lists:', httpStatus, responseText);
}

$('#listDropdown').on('show.bs.dropdown', function () {
  authenticatedXhr('GET', 'https://api.vfree.org/user/lists', callback);
})

$('#currentPageBtn').on('click', function() {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var currentUrl = tabs[0].url;
    console.log('Current URL:', currentUrl);
  });
})