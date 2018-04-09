var loopback = require("loopback");

module.exports = function(Login) {
  Login.login = function(data, options, cb) {
    if (!data.user) {
      var err2 = new Error("username is required to login");
      err2.statusCode = 400;
      err2.code = "USERNAME_REQUIRED";
      err2.retriable = false;
      cb(err2, null);
      return false;
    }
    var credentials = {
      username : data.user,
      password : data.password
    };
    options.ctx = options.ctx || {};
    options.ctx.tenantId = "default";
    var UserModel = loopback.getModelByType('BaseUser');
    UserModel.login(credentials, options, function(err, res){
      console.log('post login ', data.user);
      if (!err && data.deviceToken) {
        UserModel.findById(res.userId, options, function(err, userInstance){
            if (userInstance && userInstance.deviceToken != data.deviceToken) {
              userInstance.updateAttributes({deviceToken:data.deviceToken}, options, function(err){
                  console.log('deviceToken updated ', err, data.deviceToken);
              });
            }
        });
      } else {
        console.log('could not login or device token null ', data.deviceToken);
      }
      return cb(err, res);
    });
  };

  Login.remoteMethod("login", {
    description: "Login",
    accessType: "WRITE",
    accepts: [
      {
        arg: "data",
        type: "object",
        description: "Credentials",
        http: { source: "body" }
      }
    ],
    http: {
      verb: "POST",
      path: "/"
    },
    returns: {
      type: "object",
      root: true
    }
  });
};
