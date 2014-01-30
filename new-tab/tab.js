// display and update the clock on the new tab page.
function updateClock() {
  Date.getMinutesTwoDigits = function() {
    var retval = now.getMinutes();
    if (retval < 10) return ("0" + retval.toString());
    else return retval.toString();
  }
  Date.getHoursModTwelve = function() {
    var retval = now.getHours();
    retval = retval%12;
    if (retval == 0) retval = 12;
    return retval;
  }
  var now = new Date(),
      time = Date.getHoursModTwelve() + ':' + Date.getMinutesTwoDigits();
  document.getElementById('time').innerHTML = ["", time].join('');
  setTimeout(updateClock, 1000);
}

// add "search" capabilities to an input box.
function addSearch(elementId, callback) {
  var elem = document.getElementById(elementId);
  elem.addEventListener('keypress', function(evt) {
    if (evt.keyCode == 13) {
      callback(elem.value);
    }
  });
}

// load the bookmarks and find the "Favorites" folder.
function loadBookmarks(foldername) {
  function search(nodes) {
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].title == foldername) {
        _processFavorites(nodes[i].children);
        return;
      } else if (nodes[i].children && nodes[i].children.length > 0) {
          search(nodes[i].children);
      }
    }
  }
  chrome.bookmarks.getTree(function(nodes) { search(nodes); });
}

function _processFavorites(favorites) {
  var header = [];
      accum = [];

  for (var i = 0; i < favorites.length; i++) {
    header.push(favorites[i].title);
    accum.push(favorites[i].children);
  }
  _displayFavorites(header, accum);
}

function _displayFavorites(header, bookmarks) {
  var table = document.getElementById('bookmarks');
  // Create header row.
  var headerRow = document.createElement('tr');
  for (var i = 0; i < header.length; i++) {
    var th = document.createElement('td');
    th.appendChild(document.createTextNode(header[i]));
    headerRow.appendChild(th);
  }
  table.appendChild(headerRow);

  var zipped = _zip(bookmarks);
  for (var i = 0; i < zipped.length; i++) {
    table.appendChild(createRow(zipped[i]));
  }
}

function _zip() {
  var list_of_lists = arguments[0];
  var argLength = list_of_lists[0].length;
  var zipped = [];
  for (var i = 0; i < argLength; i++) {
    var row = [];
    for (var j = 0; j < list_of_lists.length; j++) {
      row.push(list_of_lists[j][i]);
    }
    zipped.push(row);
  }
  return zipped;
}

function createRow(bookmarks) {
  var row = document.createElement('tr');
  for (var i = 0, l = bookmarks.length; i < l; i++) {
    var td = document.createElement('td');
    var link = document.createElement('a');
    link.appendChild(document.createTextNode(bookmarks[i].title));
    link.href = bookmarks[i].url;
    td.appendChild(link);
    row.appendChild(td);
  }
  return row;
}

// Bind search handlers.
addSearch('search', function(s) {
  window.location.href = 'https://duckduckgo.com/?q=' + s;
});
addSearch('subreddit', function(s) {
  window.location.href = 'http://www.reddit.com/r/' + s;
});
addSearch('youtube', function(s) {
  window.location.href = 'http://www.youtube.com/results?search_query=' + s;
});
addSearch('weather', function(s) {
  window.location.href = 'http://www.wunderground.com/cgi-bin/findweather/getForecast?query=' + s;
});
addSearch('ups', function(s) {
  window.location.href = 'http://wwwapps.ups.com/WebTracking/processInputRequest?sort_by=status&tracknums_displayed=1&TypeOfInquiryNumber=T&loc=en_US&InquiryNumber1='+s+'&track.x=0&track.y=0';
});
/*
addSearch('testp', function(s) {
  window.location.href = 'https://testp-' + s + '.counsyl.com/helpdesk/';
});
addSearch('djangome', function(s) {
  window.location.href = 'http://django.me/' + s;
});
*/
// Display the clock and load the bookmarks table.
updateClock();
loadBookmarks('Favorites');