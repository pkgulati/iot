var loopback = require("loopback");
var async = require('async');

module.exports = function(Activity) {

    Activity.synchronize = function(array, options, cb) {
            var results = [];
            async.forEachOf(array, function(item, index, done){
                var idx = index;
                Activity.create(item, options, function(err, dbrec){
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
            function(){
                cb(null, results);
            });      
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


  var sendMessageToUser = function(ctx, userId, next) {
    var UserModel = loopback.getModelByType("BaseUser");
    UserModel.findById(userId, ctx.options, function(err, user){
        if (err) {
            return next(err);
        }
        if (!user) {
            return(next());
        }
        var FCM = loopback.getModel("FCM");
        var userId = ctx.options.ctx.userId.toString();
        var message = {
              token: user.deviceToken,
              data : {
                type: "InformationUpdateRequest",
                user : userId,
                messageForUserId : userId,
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
    } else if (ctx.isNewInstance && ctx.instance.type === "messageToContact") {
        var userId= ctx.instance.contactUserId;
        var UserModel = loopback.getModelByType("BaseUser");
        UserModel.findById(userId, ctx.options, function(err, user){
            if (err) {
                return next(err);
            }
            if (!user) {
                return(next());
            }
            var FCM = loopback.getModel("FCM");
            var userId = ctx.options.ctx.userId.toString();
            var message = {
                  token: user.deviceToken,
                  data : {
                    type: "notification",
                    user : userId,
                    messageForUserId : userId,
                    userName : ctx.options.ctx.username
                  },
                  notification : {
                      title : ctx.options.ctx.username,
                      body : ctx.instance.message
                  }
            };
            next();
            FCM.push(message, ctx.options, function(){
            });
          });
    } else {
        next();
    }
  });
};
