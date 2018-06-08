var contactUserIds = ["us1", "us2"];
var loc = {
    "name": "ajith",
    "latitude": 12.8497239,
    "longitude": 77.6658435,
    "accuracy": 27.093000411987305,
    "id": "5acd8bce50c84ff6503f97a5",
    "time": 1523420109,
    "type": "app88",
    "formattedTime": "2018-04-11T09:45:09+0530",
    "username": "ajith"
  };


  function distance(lat1, lon1, lat2, lon2) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var radlon1 = Math.PI * lon1/180
    var radlon2 = Math.PI * lon2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    dist = dist * 1609.344;
   
    return dist
}


// infosys 12.847417, 77.663111
// elite 12.905620, 77.600501

console.log('distance is ', distance(12.847417, 77.663111,12.905620, 77.600501));