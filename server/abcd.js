var loopback = require("loopback");
var async = require("async");

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
  var userId = "5acb3b18146ca8f84d18a8b0";

  var AppUser = loopback.getModelByType("AppUser");
  var UserInfoModel = loopback.getModelByType("UserInfo");
  var SwipeConfiguration = loopback.getModelByType("SwipeConfiguration");
  var SwipeData = loopback.getModelByType("SwipeData");
  async.series(
    {
      appuser: function(callback) {
        var filter = {where:{userId:userId}};
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
      }
    },
    function(err, results) {
      if (err) {
        console.log("Error ", err);
        return;
      }
      console.log(results);
      //var now = new Date();
      //var age = (now.getTime() - userInfo.lastLocationTime.getTime()) / 60000;
      //console.log("location age in minutes ", age);
      // results is now equal to: {one: 1, two: 2}
    }
  );
};

intervalFunc();
