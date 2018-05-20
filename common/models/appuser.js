var loopback = require("loopback");
var async = require("async");

module.exports = function(UserModel) {
  UserModel.prototype.data = function(options, cb) {
    console.log('fetching user data for  ', this.username);
    var userId = this.id;
    async.parallel ({
      contacts : function(done) {
        var ContactModel = loopback.getModelByType("Contact");
        var filter = {where:{ownerUserId : userId}};
        ContactModel.find(filter, options, function(err, list) {
          done(err, list);
        });
      },
      groups : function(done) {
        var ContactGroup = loopback.getModelByType("ContactGroup");
        var filter = {where:{ownerUserId : userId}};
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
          group.contactUserIds.forEach(function(userId){
            information[userId] = {};
          });
        });
        var filter = {where : {id:{inq:Object.keys(information)}}};
        var InformationModel = loopback.getModelByType("UserInfo");
        InformationModel.find(filter, options, function(err, list) {
          list.forEach(function(info){
            information[info.id] = info;
          });
          results.information = information;
          results.configuration = {
            locationJobInterval : 2400000,
            locationServiceStopTimer : 300000,
            locationServiceRestartTimer : 40000
          };
          cb(err, results);    
        });
      }
    );
};

UserModel.remoteMethod("data", {
  description: "fetch contacts and groups and their information",
  accessType: "READ",
  isStatic : false,
  accepts: [
  ],
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
