var loopback = require("loopback");
var async = require("async");

module.exports = function(UserInfo) {
  UserInfo.OnlineContacts = {};

  UserInfo.observe("after save", function(ctx, next) {
    next();
    if (ctx.instance) {
      var info = ctx.instance;
      var models = UserInfo.app.models;
      var interestedUsers = UserInfo.OnlineContacts[ctx.instance.id] || {};
      Object.keys(interestedUsers).forEach(function(userId) {
        models.AppUser.findById(userId, ctx.options, function(err, user) {
          if (user && user.deviceToken) {
            console.log('sending to user ', user.username);;
            var message = {
              token: user.deviceToken,
              data: {
                type: "ContactInformationChanged",
                messageForUserId: user.id.toString(),
                contactUserId: info.id.toString(),
                latitude: info.latitude.toString(),
                longitude: info.longitude.toString(),
                accuracy: info.accuracy.toString(),
                lastLocationTime: info.lastLocationTime.toJSON()
              }
            };
            models.FCM.push(message, ctx.options, function(err, res) {});
          }
        });
      });
    }
  });
};
