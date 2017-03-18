'use strict';

console.log('This is the Popup');

// callback = function (error, httpStatus, responseText);
function authenticatedXhr(method, url, callback) {
  var retry = true;
  function getTokenAndXhr() {
    chrome.identity.getAuthToken({'interactive': true},
      function (access_token) {
        if (chrome.runtime.lastError) {
          callback(chrome.runtime.lastError);
          return;
        }

        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader('Authorization',
          'Bearer ' + access_token);

        xhr.onload = function () {
          if (this.status === 401 && retry) {
            // This status may indicate that the cached
            // access token was invalid. Retry once with
            // a fresh token.
            retry = false;
            chrome.identity.removeCachedAuthToken(
              { 'token': access_token },
              getTokenAndXhr);
            return;
          }

          callback(null, this.status, this.responseText);
        }
      });
  }
}