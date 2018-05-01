var loopback = require("loopback");
var async = require("async");

module.exports = function(UserInfo) {

    UserInfo.observe('after save', function(ctx, next) {
        next();
        if (ctx.instance) {
            var info = ctx.instance;
            var models = UserInfo.app.models;
            models.Contact.find({where:{contactUserId:info.userId}}, ctx.options, function(err, contacts){
                var userIds = [];
                contacts.forEach(function(contact) {
                    userIds.push(contact.ownerUserId.toString());
                });
                models.AppUser.find({where:{id:{inq:userIds}}}, ctx.options, function(err, users){
                    users.forEach(function(user){
                        if (user.deviceToken && user.online) {
				console.log('sending to user ', user.username, user.userName);	
                            var message = {
                                token : user.deviceToken,
                                data : {
                                    type : "ContactInformationChanged",
                                    messageForUserId : user.id.toString(),
 				                    contactUserId : info.id.toString(),
                                    latitude : info.latitude.toString(),
                                    longitude : info.longitude.toString(),
                                    accuracy : info.accuracy.toString(),
                                    lastLocationTime : info.lastLocationTime.toJSON()
                                }
                            };
                            models.FCM.push(message, ctx.options, function(err, res){ 
                            });
                        }
                    });
                });
            });
        }
    });
 
};
