'use strict';

console.log('This is the Popup');
var response_data;  // global variable for response of AJAX GET
var selected_list = null;
var stored_list = localStorage.stored_list;


if(stored_list) {
  selected_list = stored_list;
  $('.dropdown-menu').parents('.dropdown').find('.btn').html(stored_list + ' <span class="caret"></span>');
}


/**
 * On loading the popup window, the system performs an GET request to get the user's lists
 * and then calls populate_dropdown()
 */
window.onload = function () {
    chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
      console.log('Token:', token);
      $.ajax({
        type: 'GET',
        url: 'https://api.vfree.org/user/lists',
        dataType: 'json',
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Access-Token', token);
        },
        success: function (data) {
          response_data = data;
          console.log('Response after getting lists:', response_data);
          populate_dropdown(response_data);
        },
        error: function(xhr, textStatus, errorThrown) {
          console.log('Request failed:', xhr, '\nStatus:',textStatus, '\nError:', errorThrown);
        }
      });
    });
}


/**
 * This function populates the dropdown for the Choose List button
 * @param data the JSON result of the GET request from the onload function
 */
function populate_dropdown(data) {
  var list = document.getElementById('dropdownList');
  var index;

  for (index in data.lists) {
    if (data.lists[index].archived == false) {
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


/**
* This function updates the Choose List button with the selected option
*/
$('.dropdown-menu').on('click', 'li a', function(){
  selected_list = $(this).text();
  localStorage.stored_list = selected_list;
  console.log('After selection, list:', selected_list);
  $(this).parents('.dropdown').find('.btn').html($(this).text() + ' <span class="caret"></span>');
  $(this).parents('.dropdown').find('.btn').val($(this).data('value'));
});


/**
 * Gets the URL of the currently open tab, generates the POST request
 * TODO -- needs cleanup, messy af right now
 */
$('#currentPageBtn').on('click', function() {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var currentUrl = tabs[0].url;
    var page_title = tabs[0].title;
    var description = 'Created by CL Extension.';
    var data = {'title':page_title, 'description':description, 'url':currentUrl};
    console.log('Data being sent:', JSON.stringify(data));

    if (selected_list == null) {
      $('.alert-danger').show()

    } else {
      var list_id = get_list_id();
      console.log('This is the id:', list_id);

      chrome.identity.getAuthToken({'interactive': false}, function(token) {  // send the request
        $.ajax({
          type:'POST',
          url:'https://api.vfree.org/user/list/'+list_id+'/article',
          dataType: 'json',
          contentType: 'application/json; charset=utf-8',
          data: JSON.stringify(data),
          beforeSend: function(xhr) {
            xhr.setRequestHeader('Access-Token', token);
          },
          success: function(textStatus) {
            console.log('Request success:', textStatus);
            $('.alert-success').show()
          },
          error: function(xhr, textStatus, errorThrown) {
            console.log('Request failed:', xhr, '\nStatus:',textStatus, '\nError:', errorThrown);
            $('.alert-danger').show()
          }
        });
      });
    }
  });
});


/**
 * Creates an article using the user's specified URL
 */
$('#inputBtn').on('click', function() {
  var url_input = document.getElementById('inputURL');
  var url = '';

  if (url_input.value != '') {  // if URL not empty
    const head = 'https://';
    url = head+url_input.value;
    console.log('This is the URL:', url);
  }

  var title_input = document.getElementById('inputTitle');
  var page_title = title_input.value;
  var description = 'Created by CL Extension.';

  if (page_title === '') {
    console.log('Invalid page title');
    $('.alert-danger').show()

  } else if (selected_list == null) {
    $('.alert-danger').show()

  } else if ((page_exists(url) === false) && (url != '')) {  // make sure url valid
    $('.alert-danger').show()

  } else {
    var data;
    if (url == '') {
      data = {'title':page_title, 'description':description};
    } else {
      console.log('There is a URL');
      data = {'title':page_title, 'description':description, 'url':url};
    }

    var list_id = get_list_id();
    console.log('This is the id:', list_id);
    console.log('Data being sent:', JSON.stringify(data));

    chrome.identity.getAuthToken({'interactive': false}, function(token) {  // send the request
      $.ajax({
        type:'POST',
        url:'https://api.vfree.org/user/list/'+list_id+'/article',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data),
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Access-Token', token);
        },
        success: function(textStatus) {
          console.log('Request success:', textStatus);
          $('.alert-success').show()
        },
        error: function(xhr, textStatus, errorThrown) {
          console.log('Request failed:', xhr, '\nStatus:',textStatus, '\nError:', errorThrown);
          $('.alert-danger').show()
        }
      });
    });
  }

});


/**
 * Utility function that returns the id of the uselected list
 * @returns {string|*} the unique id of the selected list
 */
function get_list_id() {
  var index
  for (index in response_data.lists) {
    if (response_data.lists[index].name === selected_list) {
      return response_data.lists[index].id;
    }
  }
}


/**
 * Utility function that ensures the user entered a valid URL by getting its page title
 * @param url the user-specified url
 */
function page_exists(url) {
  $.ajax({
    type:'HEAD',
    url: url,
    success: function() {
      console.log('Page exists!');
      return true;
    },
    error: function() {
      console.log('There was an error retrieving the page:', url);
      return false;
    }
  });
}