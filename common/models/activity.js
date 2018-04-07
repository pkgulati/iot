var loopback = require("loopback");
var async = require("async");

module.exports = function(Activity) {
  Activity.observe("after save", function(ctx, next) {
    next();

    if (ctx.isNewInstance && ctx.instance.type === "LocationRequest") {
      console.log("get contact location");
      var FCM = loopback.getModel("FCM");
      FCM.push(
        {
          data: {
            type: "LocationRequest"
          }
        },
        ctx.options,
        function() {
          console.log("FCM push callback");
        }
      );
    }
  });
};
