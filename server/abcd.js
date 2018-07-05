var loopback = require("loopback");
var async = require("async");
var moment = require("moment-timezone");

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
  var options = {
    ctx: {
      tenantId: "default"
    }
  };
  var userId = "5acb3b19146ca8f84d18a8b1";

  var AppUser = loopback.getModelByType("AppUser");
  var UserInfoModel = loopback.getModelByType("UserInfo");
  var SwipeConfiguration = loopback.getModelByType("SwipeConfiguration");
  var SwipeData = loopback.getModelByType("SwipeData");
  var FCM = loopback.getModelByType("FCM");
  async.series(
    {
      appuser: function(callback) {
        var filter = {where:{id:userId}};
        AppUser.findOne(filter, options, function(err, rec) {
          if (!rec) {
            callback(new Error("User not found " + userId));
            return;
          }
          callback(null, rec);
        });
      },
      userinfo: function(callback) {
        var filter = { where: { id: userId } };
        UserInfoModel.findOne(filter, options, function(err, rec) {
          if (!rec) {
            callback(new Error("UserInfo not found " + userId));
            return;
          }
          callback(null, rec);
        });
      },
      swipeconfig: function(callback) {
        var filter = { where: { id: userId } };
        SwipeConfiguration.findOne(filter, options, function(err, rec) {
          if (!rec) {
            callback(new Error("SwipeConfig not found " + userId));
            return;
          }
          callback(null, rec);
        });
      },
      swipedata: function(callback) {
        var filter = { where: { id: userId } };
	var now = new Date();
    	var d1 = moment(now.getTime()).tz("Asia/Calcutta");
    	var yyyymmdd = d1.format("YYYYMMDD");
    	var filter = { where: { yyyymmdd: yyyymmdd, userId: userId } };
    	SwipeData.findOne(filter, options, function(err, dbrec) {
      	   if (dbrec) {
          	callback(null, dbrec);
	   } else {
		var data = {
		  reachedOffice: false,
		  yyyymmdd: yyyymmdd,
		  userId: userId,
		  time: now.getTime(),
		  statusRemarks: "Have a good day"
		};
    	        SwipeData.create(data, options, function(err, rec) {
			callback(err, rec);
		});
	   }
        });
      }
    },
    function(err, results) {
      if (err) {
        console.log("Error ", err);
        return;
      }
	console.log('lastFCMRequestTime ', results.userinfo.lastFCMRequestTime);
	console.log('check distance and time');
      if (results.swipedata.reachedOffice) {
		console.log('already reached office');
      } else {
      	var now = new Date();
      	var age = (now.getTime() - results.userinfo.lastLocationTime.getTime()) / 60000;
      	console.log("location age in minutes ", age);
	if (age > 3) {
	var distance = calcDistance(results.swipeconfig.latitude, 
			results.swipeconfig.longitude, 
			results.userinfo.latitude, 
			results.userinfo.longitude);
	console.log('distance is ' , distance);
	if (distance < 5000) {
		var data = {
			type : 'startFCMJob',
			deviceToken : results.swipeconfig.deviceToken,
			highPriority: true,	
		}
		FCM.create(data, options, function(err, rec) {
			console.log('FCM created ', err, rec);
		});
		results.userinfo.updateAttributes({lastFCMRequestTime : now.getTime()}, options, function(err, rec) {
			console.log('lastFCMRequestTime update ' , err, rec);
		});
	}
       }
      }
    }
  );
};

intervalFunc();
