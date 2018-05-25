var loopback = require("loopback");
var async = require("async");
var moment = require("moment-timezone");
var restler = require("restler");
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

  Activity.prototype.process = function(options) {
    if (this.type == "ViewContact" && this.contactId) {
      var self = this;
      var ContactModel = loopback.getModel("Contact");
      var now = new Date();
      
      ContactModel.findById(this.contactId, options, function(err, contact) {
        if (!contact) {
          return;
        }
        contact.updateAttributes({"lastViewedAt" : now.getTime()}, options, function() {
	      });
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
        console.log(
          "view contact ",
          contact.contactUserId,
          contact.ownerUserId,
          options.ctx.userId,
          contact.name,
	        "by ",
	        options.ctx.username
        );
        sendMessageToUser(message, options, contact.contactUserId, function(err,res) {
        });
      });

      var filter = {
        where : {
          ownerUserId : this.userId,
          autofcm : true,
          id : {ne : this.contactId}
        }
      };

      ContactModel.findById(filter, options, function(err, contacts) {
        contacts.forEach(function (contact) {
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
          console.log('auto FCM send to ', contact.name,
	        "by ",
	        options.ctx.username );
          sendMessageToUser(message, options, contact.contactUserId, function(err,res) {
          });
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
      });
    } else if (this.type == "LocationServiceEnd") {
      if (this.data && 
          this.data.nameValuePairs && 
           this.data.nameValuePairs.locationNotKnown) {
             if (this.data.nameValuePairs.cid && this.data.nameValuePairs.cid > 0) {
              var data = this.data.nameValuePairs;
              var jsonData = {
                radio : "gsm",
                mcc : data.mcc,
                mnc : data.mnc,
                cells : [ {
                    lac : data.lac,
                    cid : data.cid
                }
                ],
                address : 1
              };
              var self = this;
                process.nextTick(function() {
                  jsonData.token = process.env.OPENCELLID_TOKEN || "94fc55c305d60b";
                  var restleroptions = {
                    parsers : restler.parsers.json
                  };
                  restler
                    .postJson("https://ap1.unwiredlabs.com/v2/process.php", jsonData, restleroptions)
                    .on("complete", function(data, response) {
                      // handle response
                      console.log("towerinfo ststus code " + response.statusCode);
                        console.log('data ', data);
                      if (response.statusCode == 200 && data && data.status == "ok") {
                        var Location = loopback.getModel("Location");
                        var data = {
                          latitude: data.lat,
                          longitude: this.lon,
                          userId: self.userId,
                          source : 'towerinfo',
                          locationType : 'towerinfo',
                          accuracy: data.accuracy,
                          locationTime: self.time,
                          justtime : self.justtime
                        };
                        Location.create(data, options, function(err, rec) {
                            console.log('towerinfo location created error = ', err);
                        });
                      }
                  });
                });
             }
        }
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
    ctx.instance.process(ctx.options);
  });
};
