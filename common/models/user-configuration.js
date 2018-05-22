loopback = require("loopback");

module.exports = function(UserConfiguration) {
  function fcmstringify(obj) {
    if (typeof obj !== "object" || obj === null || obj instanceof Array) {
      return value(obj);
    }

    return (
      "{" +
      Object.keys(obj)
        .map(function(k) {
          return typeof obj[k] === "function"
            ? null
            : '"' + k + '":' + value(obj[k]);
        })
        .filter(function(i) {
          return i;
        }) +
      "}"
    );
  }

  function value(val) {
    switch (typeof val) {
      case "string":
        return '"' + val.replace(/\\/g, "\\\\").replace('"', '\\"') + '"';
      case "number":
        return '"' + val + '"';
      case "boolean":
        return '"' + val + '"';
      case "function":
        return "null";
      case "object":
        if (val instanceof Date) return '"' + val.toISOString() + '"';
        if (val instanceof Array) return "[" + val.map(value).join(",") + "]";
        if (val === null) return "null";
        return fcmstringify(val);
    }
  }

  UserConfiguration.observe("after save", function locBeforeSaveFn(ctx, next) {
    if (ctx.instance) {
      var userId = ctx.instance.userId;
      var models = UserConfiguration.app.models;
      models.AppUser.findById(userId, ctx.options, function(err, user) {
        if (user && user.deviceToken) {
          console.log("sending to user ", user.username);
          var data = JSON.parse(fcmstringify(ctx.instance.toJSON()));
          data.type = "configure";
          var message = {
            token: user.deviceToken,
            data: data
          };
          models.FCM.push(message, ctx.options, function(err, res) {});
        }
      });
    }
    next();
  });
};
