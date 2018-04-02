var loopback = require("loopback");

module.exports = function(Dashboard) {
    Dashboard.fetch = function(options, cb) {
        console.log(options.ctx);
        var UserModel = loopback.getModelByType("BaseUser");
        var filter = {};
        var result = {};
        result.members = [];
        UserModel.find(filter, options, function(err, list) {
               list.forEach(function(item) {
                    result.members.push(item);
               });
               cb(null, result);
        });
    };

    Dashboard.remoteMethod("fetch", {
    description: "Login",
    accessType: "READ",
    accepts: [
      {
      }
    ],
    http: {
      verb: "GET",
      path: "/"
    },
    returns: {
      type: "object",
      root: true
    }
  });
};
