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
      ctx.instance.userId = ctx.instance.userId || ctx.options.ctx.userId;
      ctx.instance.name = ctx.instance.name || ctx.options.ctx.username;
      ctx.instance.createdBy = ctx.options.ctx.userId;
      if (ctx.instance.time) {
        ctx.instance.delay = ctx.instance.created - ctx.instance.time;
      }
      // for testing 
      if (ctx.instance.type == "LocationJobData" && ctx.instance.userId == "5acb3b18146ca8f84d18a8b0") {
        var nowDate = new Date();
        var hour = nowDate.getUTCHours();
        var mins = nowDate.getUTCMinutes();
        hour = hour + 5;
        mins = mins + 30;
        var now = hour * 60 + mins;
        if (hour == 4) {
              console.log("test startService and nextJobMinutes ", hour, now);           
              ctx.instance.name.startService = true;
              ctx.instance.nextJobMinutes = 23;
        }
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
        contact.updateAttributes(
          { lastViewedAt: now.getTime() },
          options,
          function() {}
        );
        liveLocation = contact.liveLocation || false;
        var provider = "both";
        if (contact.contactUserId == "5acb3b15146ca8f84d18a8ae") {
          provider = "network";
        }
        console.log("contact " + contact.name + " " + provider);
        var expiry = now.getMilliseconds() + 2 * 60 * 1000;
        var message = {
          android: {
            priority: "high"
          },
          data: {
            type: "InformationUpdateRequest",
            activityId: self.id.toString(),
            liveLocation: liveLocation.toString(),
            waitTime: "50000",
            provider: provider,
            time: now.getMilliseconds().toString(),
            expiry: expiry.toString()
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
        sendMessageToUser(message, options, contact.contactUserId, function(
          err,
          res
        ) {});
      });

      var filter = {
        where: {
          ownerUserId: this.userId,
          autofcm: true,
          id: { neq: this.contactId }
        }
      };
      ContactModel.find(filter, options, function(err, contacts) {
        if (err) {
          console.log("error", err);
        }
        contacts.forEach(function(contact) {
          var expiry = now.getMilliseconds() + 2 * 60 * 1000;
          var message = {
            android: {
              priority: "high"
            },
            data: {
              type: "InformationUpdateRequest",
              activityId: self.id.toString(),
              time: now.getMilliseconds().toString(),
              liveLocation: contact.liveLocation.toString(),
              expiry: expiry.toString()
            }
          };
          console.log(
            "auto FCM send to ",
            contact.name,
            "by ",
            options.ctx.username
          );
          sendMessageToUser(message, options, contact.contactUserId, function(
            err,
            res
          ) {});
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
        locationTime: this.locationTime,
        provider: this.provider
      };
      Location.create(data, options, function(err, rec) {});
    } else if (this.type == "LocationServiceEnd") {
      if (
        this.data &&
        this.data.nameValuePairs &&
        this.data.nameValuePairs.locationNotKnown
      ) {
        if (this.data.nameValuePairs.cid && this.data.nameValuePairs.cid > 0) {
          var data = this.data.nameValuePairs;
          var jsonData = {
            radio: "gsm",
            mcc: data.mcc,
            mnc: data.mnc,
            cells: [
              {
                lac: data.lac,
                cid: data.cid
              }
            ],
            address: 1
          };
          var self = this;
          process.nextTick(function() {
            jsonData.token = process.env.OPENCELLID_TOKEN || "94fc55c305d60b";
            var restleroptions = {
              parsers: restler.parsers.json
            };
            restler
              .postJson(
                "https://ap1.unwiredlabs.com/v2/process.php",
                jsonData,
                restleroptions
              )
              .on("complete", function(rdata, response) {
                // handle response
                console.log("towerinfo ststus code " + response.statusCode);
                console.log("rdata ", rdata);
                if (
                  response.statusCode == 200 && rdata && rdata.status == "ok"
                ) {
                  var Location = loopback.getModel("Location");
                  var loc = {
                    latitude: rdata.lat,
                    longitude: rdata.lon,
                    userId: self.userId,
                    source: "towerinfo",
                    locationType: "towerinfo",
                    accuracy: rdata.accuracy,
                    locationTime: self.time,
                    justtime: self.justtime
                  };
                  console.log("loc data ", loc);
                  Location.create(loc, options, function(err, rec) {
                    console.log("towerinfo location created error = ", err);
                  });
                }
              });
          });
        }
      }
    } else if (
      this.type == "InformationUpdateRequest" || this.type == "FCMResponse"
    ) {
      if (this.atHomeWifi) {
        var self = this;
        var Location = loopback.getModel("Location");
        var locrec = {
          userId: self.userId,
          source: "wifi",
          locationType: "wifi",
          accuracy: 10,
          locationTime: self.time,
          justtime: self.justtime,
          provider: "homewifi"
        };
        if (this.wifissid == "Andromeda_5G") {
          locrec.latitude = 12.9603608;
          locrec.longitude = 77.5256268;
        } else if (this.wifissid == "pkgwifi") {
          locrec.latitude = 12.90475;
          locrec.longitude = 77.60055;
        } else if (this.wifissid == "MasterBlaster") {
          locrec.latitude = 12.8587013;
          locrec.longitude = 77.6128877;
        } else if (this.wifissid == "Agrawalla29") {
          locrec.latitude = 12.900803955622955;
          locrec.longitude = 77.67353189751772;
        } else if (this.wifissid == "sharada") {
          locrec.latitude = 12.9027769;
          locrec.longitude = 77.6476618;
        }
        if (locrec.latitude) {
          Location.create(locrec, options, function(err, rec) {
            // console.log("wifi location created error = ", err, locrec, rec.id);
          });
        }
      }
    } else if (this.type == "LocationJobResult") {
      var Location = loopback.getModel("Location");
      var postGPS = false;
      var postNetwork = false;
      if (this.gpsLocation && this.networkLocation) {
        if (this.gpsAccuracy < this.networkAccuracy) {
          postGPS = true;
        } else {
          postNetwork = true;
        }
      } else if (this.gpsLocation) {
        postGPS = true;
      } else if (this.networkLocation) {
        postNetwork = true;
      } else {
        // check wifi
      }

      var data = null;
      if (postGPS) {
        data = {
          latitude: this.gpsLatitude,
          longitude: this.gpsLongitude,
          userId: this.userId,
          accuracy: this.gpsAccuracy,
          justtime: this.justtime,
          locationTime: this.gpsLocationTime,
          hasSpeed: this.gpsHasSpeed,
          speed: this.gpsSpeed,
          provider: "gps"
        };
      } else if (postNetwork) {
        data = {
          latitude: this.networkLatitude,
          longitude: this.networkLongitude,
          userId: this.userId,
          accuracy: this.networkAccuracy,
          justtime: this.justtime,
          locationTime: this.networkLocationTime,
          hasSpeed: this.networkHasSpeed,
          speed: this.networkSpeed,
          provider: "network"
        };
      } else if (this.cid > 0 && this.lac > 0) {
        var self = this;
        var jsonData = {
          radio: "gsm",
          mcc: self.mcc,
          mnc: self.mnc,
          cells: [
            {
              lac: self.lac,
              cid: self.cid
            }
          ],
          address: 1
        };
        process.nextTick(function() {
          jsonData.token = process.env.OPENCELLID_TOKEN || "94fc55c305d60b";
          var restleroptions = {
            parsers: restler.parsers.json
          };
          restler
            .postJson(
              "https://ap1.unwiredlabs.com/v2/process.php",
              jsonData,
              restleroptions
            )
            .on("complete", function(rdata, response) {
              // handle response
              console.log("towerinfo ststus code " + response.statusCode);
              console.log("rdata ", rdata);
              if (response.statusCode == 200 && rdata && rdata.status == "ok") {
                var Location = loopback.getModel("Location");
                var locrec = {
                  latitude: rdata.lat,
                  longitude: rdata.lon,
                  userId: self.userId,
                  source: "towerinfo",
                  locationType: "towerinfo",
                  accuracy: rdata.accuracy,
                  locationTime: self.time,
                  justtime: self.justtime,
                  provider: "tower"
                };
                Location.create(locrec, options, function(err, rec) {
                  console.log(
                    "towerinfo location created error = ",
                    err,
                    locrec,
                    rec.id
                  );
                });
              }
            });
        });
      }
      if (data) {
        Location.create(data, options, function(err, rec) {
          if (rec) {
            console.log("location created out of LocationJobResult " + rec.id);
          }
        });
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
