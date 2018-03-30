var loopback = require("loopback");

module.exports = function(Login) {
  Login.login = function(data, options, cb) {
    var credentials = {
      username: data.user,
      password: data.password,
      tenantId: "default"
    };

    var UserModel = loopback.getModelByType("BaseUser");
    UserModel.login(credentials, options, cb);
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
