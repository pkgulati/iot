var loopback = require("loopback");
//var async = require("async");
var moment = require("moment-timezone");

module.exports = function() {
  
  function calcDistance(lat1, lon1, lat2, lon2) {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var radlon1 = Math.PI * lon1 / 180;
    var radlon2 = Math.PI * lon2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1609.344;

    return dist;
  }

  var intervalFunc = function() {
    console.log("Run timer.js intervalFunc");
    var options = {
      ctx: {
        tenantId: "default"
      }
    };

    // based on current hour, last known location, location age
    //  if location is away from home..
    //      if location is office
    // 		If we do nt know checkin time
    // 			assume based on day of week
    // 	arrive expected checkout time
    //     if near then try get location if last request is old enough
    var UserInfoModel = loopback.getModelByType("UserInfo");

    var filter = { where: { id: "5acb3b18146ca8f84d18a8b0" } };

    UserInfoModel.findOne(filter, options, function(err, userInfo) {
      if (!userInfo) {
        return;
      }

      var ist = moment(ctx.instance.created).tz("Asia/Calcutta");

      console.log("Check on ", ist.format().substr(11, 8));

      console.log("last location time ", userInfo.lastLocationTime);
      console.log("Last last location is ", userInfo.lastLocationTime);

      var d1 = calcDistance(
        userInfo.latitude,
        userInfo.longitude,
        userInfo.baseLatitude,
        userInfo.baseLongitude
      );

      console.log("distance from base location is ", d1);

      var now = new Date();
      var age = (now.getTime() - userInfo.lastLocationTime.getTime()) / 60000;
      console.log("location age in minutes ", age);
    });
  };

  // For testing one minute
  var ONE_MINUTE = 60000;
  var TWO_MINUTE = 120000;
  var FIVE_MINUTE = 300000;

  //setInterval(intervalFunc, FIVE_MINUTE);

};
