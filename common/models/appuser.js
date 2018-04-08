var loopback = require("loopback");
var async = require("async");

module.exports = function(UserModel) {
  UserModel.contactInfo = function(users, options, cb) {
    var response = [];
    if (!options.ctx.userId) {
        return cb(null, response);
    }
    var filter = {
        where : {
            userId : options.ctx.userId
        }
    };

    var ContactModel = loopback.getModelByType("Contact");
    var UserInfoModel = loopback.getModelByType("UserInfo");
    var TeamMemberModel = loopback.getModelByType("TeamMember");
    
    ContactModel.find(filter, options, function(err, list) {
        async.mapSeries(list, function(contact, done) {
            var id = contact.contactUserId || contact.contactId;
            UserInfoModel.findById(id, options, function(err, dbinfo){
                done(null, dbinfo);
            });
        }, function(err, results) {
            cb(err, results);
        });
    });

    var filter2 = {
      where : {
          userId : options.ctx.userId
      }
    };

    TeamMemberModel.find(filter2, options, function(err, list) {
    });



};

};
