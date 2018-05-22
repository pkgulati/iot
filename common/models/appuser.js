var loopback = require("loopback");
var async = require("async");

module.exports = function(UserModel) {
  UserModel.prototype.nextjob = function(options, cb) {
    var interval = 30;
    var nowDate = new Date();
    var hour = nowDate.getHours();
    var mins = nowDate.getMinutes();
    var now = hour * 60 + mins;
    var name = this.name;
    
    var am5 = 300;
    var am7 = 420;
    var am9 = 540;
    var am10 = 600;
    var am11 = 660;
    
    var pm7 = 1140;
    var pm830 = 1230;
    var pm10 = 1320;

    if (now < am5) {
      interval = 60;
    } else if (now > pm10) {
      interval = 60;
    } else if (now > am7 && now < am10) {
      interval = 20;
    } else {
      interval = 40;
    }

    if (name == "shashi") {
      interval = 23;
      if (now >= am9 && now <= am11) {
        interval = 15;
      }
      if (now >= pm7 && now <= pm830) {
        interval = 10;
      }
    }

    if (name == "rohit") {
      if (now < 420) {
        interval = 422 - now;
      } else if (now > 1320) {
        interval = 1442 - now + 720;
      } else if (now > 600) {
        interval = 60;
      } else {
        interval = 20;
      }
    }

    // mins to milliseconds
    var res = {
      milliseconds: interval * 60 * 1000
    };

    var context = {
      Model: UserModel,
      instance: this,
      options: options,
      data : res
    };

    UserModel.notifyObserversOf('nextjob', context, function (err) {
      res = context.data;
      cb(null, res);
    });

  };

  UserModel.observe("nextjob", function(ctx, next) {
    ctx.data.foo = 'bar';
    next();
  });
    
  UserModel.remoteMethod("nextjob", {
    description: "fetch nextjob interval",
    accessType: "READ",
    isStatic: false,
    accepts: [],
    http: {
      verb: "GET",
      path: "/nextjob"
    },
    returns: {
      type: "object",
      root: true
    }
  });

  UserModel.prototype.data = function(options, cb) {
    console.log("fetching user data for  ", this.username);
    var userId = this.id;
    async.parallel(
      {
        contacts: function(done) {
          var ContactModel = loopback.getModelByType("Contact");
          var filter = { where: { ownerUserId: userId } };
          ContactModel.find(filter, options, function(err, list) {
            done(err, list);
          });
        },
        groups: function(done) {
          var ContactGroup = loopback.getModelByType("ContactGroup");
          var filter = { where: { ownerUserId: userId } };
          ContactGroup.find(filter, options, function(err, list) {
            done(err, list);
          });
        }
      },
      function(err, results) {
        var information = {};
        results.contacts.forEach(function(contact) {
          information[contact.contactUserId] = {};
        });
        results.groups.forEach(function(group) {
          group.contactUserIds.forEach(function(userId) {
            information[userId] = {};
          });
        });
        var filter = { where: { id: { inq: Object.keys(information) } } };
        var InformationModel = loopback.getModelByType("UserInfo");
        InformationModel.find(filter, options, function(err, list) {
          list.forEach(function(info) {
            information[info.id] = info;
          });
          results.information = information;
          results.configuration = {
            locationJobInterval: 2400000,
            locationServiceStopTimer: 300000,
            locationServiceRestartTimer: 40000
          };
          cb(err, results);
        });
      }
    );
  };

  UserModel.remoteMethod("data", {
    description: "fetch contacts and groups and their information",
    accessType: "READ",
    isStatic: false,
    accepts: [],
    http: {
      verb: "GET",
      path: "/data"
    },
    returns: {
      type: "object",
      root: true
    }
  });
};
