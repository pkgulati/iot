var loopback = require("loopback");
var async = require("async");

module.exports = function(UserModel) {
  UserModel.prototype.dashboard = function(options, cb) {
    console.log('this user Id ', this.id);
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
        cb(err, results);
      }
    );
};

UserModel.remoteMethod("dashboard", {
  description: "fetch contacts and groups and their information",
  accessType: "READ",
  isStatic : false,
  accepts: [
  ],
  http: {
    verb: "GET",
    path: "/dashboard"
  },
  returns: {
    type: "object",
    root: true
  }
});

};
