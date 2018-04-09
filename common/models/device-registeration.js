module.exports = function(DeviceRegistration) {

  DeviceRegistration.observe("before save", function(ctx, next) {
    if (ctx.isNewInstance) {
        ctx.instance.userId = ctx.instance.userId || ctx.options.ctx.userId;
    } else {
        delete ctx.instance.userId;
    }
    next();
  });

  DeviceRegistration.observe("after save", function(ctx, next) {
    if (ctx.isNewInstance) {
      var UserModel = loopback.getModelByType("User");
      UserModel.findById(ctx.instance.userId, options, function(
        err,
        userInfo
      ) {
        if (userInfo) {
          userInfo.updateAttributes(
            {
              deviceToken: ctx.instance.deviceToken
            },
            options,
            function(err, dbresult) {
              console.log(
                "update of registrationToken  ",
                err,
                dbresult.name,
                token
              );
              // ignore error
              next(null);
            }
          );
        } else {
          next(null, {});
        }
      });
    } else {
      next();
    }
  });
};