var loopback = require("loopback");

module.exports = function(Login) {
  Login.login = function(data, options, cb) {
   
    if (!data.email) {
      var err2 = new Error("email is required to login");
      err2.statusCode = 400;
      err2.code = "USERNAME_EMAIL_REQUIRED";
      err2.retriable = false;
      cb(err2, null);
      return false;
    }
    var UserModel = loopback.getModelByType("BaseUser");
    var filter = {
        where : {
            email: data.email
        }
    };
    options.ctx = options.ctx || {};
    options.ctx.tenantId = "defult";
    UserModel.findOne(filter, options, function findOneCb(err, user) {
      if (user) {
        UserModel.login(data, options, cb);
      } else {
        var nameParts = data.email.split("@");
        if (nameParts.length != 2) {
          var err2 = new Error("email is required to login");
          err2.statusCode = 400;
          err2.code = "USERNAME_EMAIL_REQUIRED";
          err2.retriable = false;
          cb(err2, null);
          return false;
        }
        var userData = {
          username: data.email,
          email: data.email,
          emailVerified: true,
          password: data.password
        };
        UserModel.create(userData, options, function(err, newUser) {
          if (err) {
            var defaultError = new Error('Could not automatically sign in');
            defaultError.statusCode = 401;
            defaultError.code = 'LOGIN_FAILED';
            defaultError.retriable = false;
            err.additionalMessage = "Could not automatically sign in";
            return cb(err, null);
          }
          console.log("newUser created ", newUser.id, newUser.username);
          UserModel.login(data, options, cb);
        });
      }
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
