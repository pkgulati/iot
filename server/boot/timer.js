var loopback = require("loopback");
//var async = require("async");

module.exports = function() {
  var intervalFunc = function() {
	console.log('Run timer.js intervalFunc');
 var options = {
        ctx: {
          tenantId: 'default'
        }
    };


function calcDistance(lat1, lon1, lat2, lon2) {
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

    // based on current hour, last known location, location age
    //  if location is away from home..
    //      if location is office 
    // 		If we do nt know checkin time 
   // 			assume based on day of week
  // 	arrive expected checkout time	
  //     if near then try get location if last request is old enough
    var UserInfoModel = loopback.getModelByType("UserInfo");
    var filter = {where : {id : '5acb3b18146ca8f84d18a8b0'}};
        UserInfoModel.findOne(filter, options, function(err, userInfo) {
          if (userInfo) {
		var d1 = calcDistance(userInfo.latitude, userInfo.longitude, userInfo.baseLatitude, userInfo.baseLongitude);
		console.log('distance is ' , d1);
            var now = new Date();
            var age = (now.getTime() - userInfo.lastLocationTime.getTime())/60000;
		var t1 =  now.getTime() - userInfo.lastRequestTime;
		console.log('t1 is ' , t1);
		if (d1 > 100 && d1 < 20000 && t1 > 120000) {
			var FCM = loopback.getModelByType("FCM");
			FCM.create({'type':'startLocationJob', 'userId' : userInfo.id}, options, function(err, record) {
				if (record) {
					console.log('record created ', record);
				}	
				if (err) {
					console.log('error in FCM create', err);
				}
			});	
			userInfo.updateAttributes({'lastRequestTime':now.getTime()}, options, function(err, updrec) {
				if (updrec) {
					console.log('record updated ', updrec.lastRequestTime);
				}
			});
		}
            console.log('age in minutes ' + age);
          }
	  else {
		console.log('no user found with id');
	  }
        });
  };
  //setInterval(intervalFunc, 600000);
};
