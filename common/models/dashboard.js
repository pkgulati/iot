var loopback = require("loopback");

module.exports = function(Dashboard) {
  
    Dashboard.fetch = function(options, cb) {
        console.log(options.ctx);
        var result = {};
        cb(null, result);
    };

    Dashboard.remoteMethod("fetch", {
    description: "Fetch data post login",
    accessType: "READ",
    accepts: [
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
