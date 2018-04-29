var loopback = require("loopback");
var async = require("async");

module.exports = function(Contact) {
  Contact.prototype.requestinfo = function(options, cb) {

    

    var UserModel = loopback.getModelByType("AppUser");
    var contactUserId = this.contactUserId;
    console.log('contact requestinfo by ', options.ctx.username, ' for contact ', contactUserId);
    UserModel.findById(contactUserId, options, function(err, user) {
      if (err) {
        return cb(err);
      }
      if (!user) {
          console.log('user not found for id ', contactUserId);
          return cb();
      }
      var Activity = loopback.getModelByType('Activity');
      var date = new Date();
      Activity.create({type:"RequestInfo", name:options.ctx.username, rquestedFor:user.username, time:date}, options, function(err, rec){
        console.log('actiivity created RequestInfo ', err ? err : ' id = ', rec ? rec.id.toString() : '');
      });

      if (!user.deviceToken) {
        console.log('deviceToken not set for ', contactUserId);
        return cb();
      }
      var FCM = loopback.getModel("FCM");
      var userId = options.ctx.userId ? options.ctx.userId.toString() : "";
      var message = {
        token: user.deviceToken,
	android: {
		priority : "high"
	},
        data: {
          type: "InformationUpdateRequest",
          messageForUserId : contactUserId,
          requestUserId: userId,
          requestUserName: options.ctx.username,
          text: "Please send latest information"
        }
      };
      cb(null, {'status':'message prepared'});
      FCM.push(message, options, function(){
          console.log('FCM message callback');
      });
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
