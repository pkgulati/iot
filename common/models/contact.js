var loopback = require("loopback");
var async = require("async");

module.exports = function(Contact) {
  Contact.prototype.requestinfo = function(options, cb) {
    var UserModel = loopback.getModelByType("AppUser");
    var contactUserId = this.contactUserId;
    console.log('get for contactUserId ', options.ctx.userId.toString(), this.ownerUserId, contactUserId);
    UserModel.findById(contactUserId, options, function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
          console.log('user not found for id ', contactUserId);
          return cb();
      }
      var FCM = loopback.getModel("FCM");
      var userId = options.ctx.userId.toString();
      var message = {
        token: user.deviceToken,
        data: {
          type: "InformationUpdateRequest",
          requestUserId: userId,
          requestUserName: options.ctx.username,
          text: "Please send latest information"
        }
      };
      FCM.push(message, options, cb);
    });
  };

  Contact.remoteMethod("requestinfo", {
    description: "Request latest info",
    accessType: "WRITE",
    isStatic: false,
    accepts: [],
    http: {
      verb: "POST",
      path: "/requestinfo"
    },
    returns: {
      type: "object",
      root: true
    }
  });
};
