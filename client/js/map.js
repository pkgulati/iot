// Global vars
var map, feInt, cyInt, cy = 0, currentData = {};
var socket = io();
var xhr1 = new XMLHttpRequest();

// init Google Map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: new google.maps.LatLng(13.00, 77.65)
  });

  // Stop centering markers after a drag operation
  map.addListener('drag', function () {
    clearInterval(cyInt);
  });
}

// WebSocket connection check
socket.on('connect', function (msg) {
  console.log('Connected to WS');
});
// Render new WebSocket received data
socket.on('message1', function (msg) {
  console.log(msg);
  render([msg]);
});

// Get server data and render on first-time load of page
function fetch() {
  xhr1.onreadystatechange = function () {
    if (this.status == 200 && this.readyState == 4) {
      locations = JSON.parse(this.responseText);
      render(locations);
    }
  };
  xhr1.open('GET', "/redApi/locationData/?t=" + new Date().getTime(), true);
  xhr1.send();

}

// Set ny name from addressbar anchor value into text box
function setMe() {
  var me = window.location.href.split("#").length>1?window.location.href.split("#")[1]:"";
  document.getElementById('me').value = me;
}

// Render location array data on map. Creates new markers for each new name, 
// updates position and time for existing markers. 
function render(results) {  // results --> Array [time (sec since 1/1/1970) , latitude (number), longitude (number), name, accuracy (m), type (GPS, NET, URL)]]
  var popup, c;
  //  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < results.length; i++) {
    if (!results[i].name) continue;  // Skip if data has no name
    var latLng = new google.maps.LatLng(results[i].latitude, results[i].longitude);
//    bounds.extend(latLng);

    // Calculation of marker color based on recency. 0 sec implies Blue, CSECS sec implies White.
    var CSECS = 7200;  // Seconds at the end of which marker color turns white 
    var sec = results[i].time;  // in seconds from 1/1/1970
    var seconds = new Date().getTime() / 1000 - sec; // time elapsed since this location, in sec
    var R = Number(((255 * (seconds < CSECS ? seconds : CSECS) / CSECS)).toFixed(0));  // Get a number between 0 and 255 as elapsed time varies from 0 to CSECS.
    R = R.toString(16);   // convert to HEX
    R = (R.length == 1 ? "0" : "") + R; // pad HEX with 0 if required
    G = R;  // Green and Red to be same for Blue to fade to White
    B = "FF";  // Blue to be 255 always for Blue to fade to White
    var RGB = "#" + R + G + B;  // put RGB together
    var textcolor = R > 128 ? "black" : "white";  // flip color for better contrast
    

    // Calculate 'time ago' for displaying in marker
    var days = Math.floor(seconds / (3600 * 24));
    seconds -= days * 3600 * 24;
    var hrs = Math.floor(seconds / 3600);
    seconds -= hrs * 3600;
    var mnts = Math.floor(seconds / 60);
    seconds -= mnts * 60;
    t = (days != 0 ? days + "d " : "") + (hrs != 0 ? hrs + "h " : "") + (mnts != 0 ? mnts + "m " : "") + ((days == 0 && hrs == 0 && mnts == 0) ? seconds.toFixed(0) + "s " : "");
    
    // Create the marker
    var dv = document.createElement('div');
    dv.style.backgroundColor = RGB;
    dv.innerHTML = "<CENTER><img src='/images/" + results[i].name + ".jpg' alt='" + results[i].name + "'><BR><B><font color='" + textcolor + "'>" + t + " ago</font></B></CENTER>";
    if (!currentData[results[i].name]) {  // check if this is a new name
      popup = new Popup(latLng, dv);  // create a new Popup (marker)
      popup.setMap(map);

      // Push the new data into the currentData object
      currentData[results[i].name] = {};
      currentData[results[i].name].popup = popup;
      currentData[results[i].name].latLng = latLng;
      currentData[results[i].name].dbrec = results[i];
      if (results[i].accuracy) {  // check if accuracy is specified
        c = new google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 1,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map: map,
          center: latLng,
          radius: results[i].accuracy
        });
        currentData[results[i].name].circle = c;
      }

    } else {  // if this is an existing name ...
      // retrieve data from currentData
      popup = currentData[results[i].name].popup;  
      c = currentData[results[i].name].circle;
      if (c) { c.setCenter(latLng); c.setRadius(results[i].accuracy); }
      if (!c && results[i].accuracy) {
        c = new google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 1,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map: map,
          center: latLng,
          radius: results[i].accuracy
        });
        currentData[results[i].name].circle = c;
      }
      popup.setMap(null);
      popup = new Popup(latLng, dv);
      popup.setMap(map);
      currentData[results[i].name].popup = popup;
      currentData[results[i].name].dbrec = results[i];
      currentData[results[i].name].latLng = latLng;
    }
  }
  //        map.panToBounds(bounds);
}

// center the next marker when called
function cycle() {
  var names = Object.keys(currentData);
  currentLatLng = currentData[names[cy++]].latLng;
  if (cy > names.length - 1) cy = 0;
  map.setZoom(14);
  map.panTo(currentLatLng);
}

// refresh times for all markers (using existing client data (no server call))
function refresh() {
  var data = Object.keys(currentData).map(function (o) {
    return (currentData[o].dbrec);
  });
  render(data);
}

// refresh and cycle every 5 seconds
feInt = setInterval(refresh, 5000);
cyInt = setInterval(cycle, 5000);