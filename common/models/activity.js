var loopback = require("loopback");

module.exports = function(Activity) {

  var sendMessageToUser = function(ctx, userId, next) {
    var UserInfoModel = loopback.getModel("UserInfo");
    UserInfoModel.findById(userId, ctx.options, function(err, userinfo){
        if (err) {
            return next(err);
        }
        if (!userinfo) {
            return(next());
        }
        if (!userinfo.deviceToken) {
            return(next());
        }
        var FCM = loopback.getModel("FCM");
        var userId = ctx.options.ctx.userId.toString();
        var message = {
              token: userinfo.deviceToken,
              data : {
                type: "InformationUpdateRequest",
                user : userId,
                userName : ctx.options.ctx.username,
                text : "Please send latest information"
              }
        };
        FCM.push(message, ctx.options, next);
      });
    };

    var sendMessage = function(ctx, next) {
    // TODO - Validate whether contact is user allowed contact
    var contactId = ctx.instance.data.contactId;
    var ContactModel = loopback.getModel("Contact");
    ContactModel.findById(contactId, ctx.options, function(err, contact){
        if (err) {
            return next(err);
        }
        if (!contact) {
            return next();
        }
        sendMessageToUser(ctx, contact.contactUserId, next);
    });
  };

  Activity.observe("after save", function(ctx, next) {
    if (ctx.isNewInstance && ctx.instance.type === "ViewContactDetails" &&
    ctx.instance.data && ctx.instance.data.contactId) {
        sendMessage(ctx, next);
    } else {
        next();
    }
  });
};