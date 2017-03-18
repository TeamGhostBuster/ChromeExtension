'use strict';

console.log('This is the Popup');



callback = function(error, httpStatus, responseText) {
  console.log('Response after authenticatedXhr to get lists:', httpStatus, responseText);
}

$('#listDropdown').on('show.bs.dropdown', function () {
  authenticatedXhr('GET', 'https://demo.vfree.org/user.lists', callback)
})