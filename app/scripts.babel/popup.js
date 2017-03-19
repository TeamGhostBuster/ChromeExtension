'use strict';

console.log('This is the Popup');


window.onload = function () {
    chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
      console.log('Token:', token);
      $.ajax({
        type: 'GET',
        url: 'http://localhost:5000/user/lists',
        dataType: 'json',
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Access-Token', token);
        },
        success: function (data) {
          console.log('Response after getting lists:', data);
          populate_dropdown(data);
        },
        error: function(xhr, textStatus, errorThrown) {
          console.log('Request failed:', xhr, '\nStatus:',textStatus, '\nError:', errorThrown);
        }
      });
    });
}

function populate_dropdown(data) {
  var list = document.getElementById('dropdownList');
  var index;

  for (index in data.lists) {
    if (data.lists[index].archived != 'True') {
      var name = data.lists[index].name;
      var li = document.createElement('li');
      var link = document.createElement('a');
      var text = document.createTextNode(name);
      link.appendChild(text);
      link.href = '#';
      li.appendChild(link);
      list.appendChild(li);
    }
  }
}

$('.dropdown-menu').on('click', 'li a', function(){
  $(this).parents('.dropdown').find('.btn').html($(this).text() + ' <span class="caret"></span>');
  $(this).parents('.dropdown').find('.btn').val($(this).data('value'));
});

$('#currentPageBtn').on('click', function() {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var currentUrl = tabs[0].url;
    console.log('Current URL:', currentUrl);
  });
})