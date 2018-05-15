var loopback = require("loopback");
var async = require("async");
var moment = require("moment-timezone");

module.exports = function(Activity) {
  Activity.synchronize = function(array, options, cb) {
    var results = [];
    async.forEachOf(
      array,
      function(item, index, done) {
        var idx = index;
        Activity.create(item, options, function(err, dbrec) {
          results[idx] = {};
          if (err && err.code == 11000) {
            results[idx].error = null;
          } else {
            results[idx].error = err;
          }
          results[idx].data = dbrec ? dbrec : item;
          done(null);
        });
      },
      function() {
        cb(null, results);
      }
    );
  };

  Activity.remoteMethod("synchronize", {
    description: "Synchrnozed",
    accessType: "WRITE",
    accepts: [
      {
        arg: "data",
        type: "Array",
        description: "Model instance data",
        http: { source: "body" }
      }
    ],
    http: {
      verb: "POST",
      path: "/synchronize"
    },
    returns: {
      type: "Array",
      root: true
    }
  });

  var sendMessageToUser = function(message, options, userId, next) {
    var UserModel = loopback.getModelByType("BaseUser");
    UserModel.findById(userId, options, function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next();
      }
      next();
	if (user.deviceToken) {
      var FCM = loopback.getModel("FCM");
      message.token = user.deviceToken;
      FCM.push(message, options, function(err, res) {
        console.log("FCM ", err, res);
      });
	}
    });
  };

  Activity.observe("before save", function(ctx, next) {
    if (ctx.isNewInstance && ctx.instance) {
      ctx.instance.created = new Date();
      ctx.instance.userId = ctx.options.ctx.userId;
      ctx.instance.name = ctx.options.ctx.username;
	if (ctx.instance.time) {
        ctx.instance.delay = ctx.instance.created - ctx.instance.time; 
      }
    }
    next();
  });

  Activity.prototype.process = function(options, cb) {
    if (this.type == "ViewContact") {
      if (!this.contactId) {
        return cb(null);
      }
      var self = this;
      var ContactModel = loopback.getModel("Contact");
      ContactModel.findById(this.contactId, options, function(err, contact) {
        if (err) {
          return cb(err);
        }
        if (!contact) {
          return cb();
        }
        var now = new Date();
        var expiry = now.getMilliseconds() + 2 * 60 * 1000;
        var message = {
          android: {
            priority: "high"
          },
          data: {
            type: "InformationUpdateRequest",
            activityId: self.id.toString(),
            time : now.getMilliseconds().toString(),
            expiry : expiry.toString()
          }
        };
        var UserInfo = loopback.getModelByType("UserInfo");
        // assuming single nodejs instance for this app
        UserInfo.OnlineContacts[contact.contactUserId] = UserInfo
          .OnlineContacts[contact.contactUserId] || {};
        var timer =
          UserInfo.OnlineContacts[contact.contactUserId][options.ctx.userId];
        if (timer) {
          clearTimeout(timer);
        }
        console.log(
          "view contact ",
          contact.contactUserId,
          contact.ownerUserId,
          options.ctx.userId,
          contact.name
        );
        UserInfo.OnlineContacts[contact.contactUserId][
          options.ctx.userId
        ] = setTimeout(function() {
          console.log("clear online view " + contact.name);
          clearTimeout(
            UserInfo.OnlineContacts[contact.contactUserId][options.ctx.userId]
          );
          delete UserInfo
            .OnlineContacts[contact.contactUserId][options.ctx.userId];
        }, 90 * 1000);
        sendMessageToUser(message, options, contact.contactUserId, function(
          err,
          res
        ) {
          console.log("message sent ", err, res);
          cb(err, res);
        });
      });
    } else if (this.type == "LocationResult") {
      var Location = loopback.getModel("Location");
      var data = {
        latitude: this.latitude,
        longitude: this.longitude,
        userId: this.userId,
        accuracy: this.accuracy,
        justtime: this.justtime,
        locationTime: this.locationTime
      };
      Location.create(data, options, function(err, rec) {
        cb(err, rec);
      });
    } else if (this.type == "StopViewContact") {
      if (!this.contactId) {
        return cb(null);
      }
      var self = this;
      var ContactModel = loopback.getModel("Contact");
      ContactModel.findById(this.contactId, options, function(err, contact) {
        if (err) {
          return cb(err);
        }
        if (!contact) {
          return cb();
        }
        var UserInfo = loopback.getModelByType("UserInfo");
        // assuming single nodejs instance for this app
        UserInfo.OnlineContacts[contact.contactUserId] = UserInfo
          .OnlineContacts[contact.contactUserId] || {};
        var timer =
          UserInfo.OnlineContacts[contact.contactUserId][options.ctx.userId];
        if (timer) {
          console.log('StopViewContact ' + contact.name);
          clearTimeout(timer);
          delete UserInfo.OnlineContacts[contact.contactUserId][
            options.ctx.userId
          ];
        }
      });
    } else {
      cb(null);
    }
  };

  Activity.observe("after save", function(ctx, next) {
    next();
    if (!ctx.isNewInstance) {
      return;
    }
    if (!ctx.instance) {
      return;
    }

    var ist = moment(ctx.instance.created).tz("Asia/Calcutta");
    console.log(
      "activity ",
      ctx.instance.type,
      ctx.instance.justtime,
      ist.format().substr(11, 8),
      ctx.instance.name,
      ctx.instance.id
    );
    ctx.instance.process(ctx.options, function() {});
  });
};
