var loopback = require("loopback");
var async = require("async");

module.exports = function(UserModel) {
  UserModel.prototype.nextjob = function(options, cb) {
    var interval = 30;
    var now = new Date();
    var hour = now.getHours();
    var mins = now.getMinutes();
    var total = hour * 60 + mins;
    var name = this.name;
    if (total < 240) {
      interval = 90;
    }
    else if (total < 300) {
      // before 5 am
        interval = 30;
    } else if (total < 420) {
      // 5 to 7
      interval = 25;
    } else if (total < 480) {
      // 7 to 8
      interval = 20;
    }  else if (total < 540) {
      // 8 to 9 
      interval = 15;
      if (name == "shashi") {
        interval = 20;
      } 
    } else if (total < 600) {
      // 9 to 10
      interval = 15;
    } else if (total < 660) {
      interval = 30;
      if (name == "shashi") {
        interval = 15;
      }
    } else if (total < 1050) {
      // 5:30 pm
      interval = 30;
    } else if (total < 1260) {
      interval = 15;
    } else if (total < 1380) {
      interval = 30;
    } else {
      interval = 90;
    }

    if (name == "rohit") {
       if (total < 420) {
         interval = 422 - total;
       }
       else if (total > 1320) {
         interval = 1442 - total + 720;
       }
       else if (total > 600) {
          interval = 60;
       } else {
          interval = 30;
       }
    }

    // mins to milliseconds
    var res = {
      milliseconds : interval * 60 * 1000
    };
    cb(null, res);
  };

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
