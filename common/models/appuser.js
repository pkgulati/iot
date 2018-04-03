var loopback = require("loopback");
var async = require('async');

module.exports = function(UserModel) {
  
    UserModel.createContacts = function(user, options, cb) {
        var userId = (typeof user.id === 'String') ? user.id : user.id.toString();
        var filter = {
            where : {
                team : user.team,
                id : { neq : userId}
            }
        };
        var ContactModel = loopback.getModelByType('Contact');
        UserModel.find(filter, options, function(err, list) {
            console.log('users in team ', list.length);
            async.mapSeries(list, function(cuser, done) {
                var contacts = [
                    {
                        userId : user.id,
                        contactId : cuser.id,
                        name : cuser.username
                    },
                    {
                        userId : cuser.id,
                        contactId : user.id,
                        name : user.username
                    }
                ];
                ContactModel.create(contacts, options, function(err, dbrec){
                    done(err, dbrec);
                });
            }, function(err, allrecs) {
                cb(null, allrecs);
            });
        });
    };

    UserModel.observe('after save', function (ctx, next) {
		if (ctx.isNewInstance && ctx.instance.team) {
            UserModel.createContacts(ctx.instance, ctx.options, function(err, contacts){
                console.log('contacts created ', contacts);
                next();
            });
         };
    });
    
    UserModel.signup = function(data, options, cb) {
    
    var filter = {
        where : {
            or : [
                {username : data.username},
                {email:data.email}
            ]
        }
    };

    UserModel.find(filter, options, function(err, dblist) {
        if (err) {
            return cb(err, null);
        }
        if (dblist.length > 0) {
           var err2 = new Error("User already registered, if having trouble in login, plese reset your password");
           err2.statusCode = 401;
           err2.code = "USER_ALREADY_REGISTERED";
           return cb(err2, null);
        } else {
            console.log('not registered already ', data.username);;
        }

        UserModel.create(data, options, function(err, newuser) {
            if (err) {
                console.log('could not create');
                return cb(err, null);
            }
            console.log('newuser ', JSON.stringify(data), newuser.id);
            UserModel.login(data, options, function(err, token){
                console.log('token ', token);
                return cb(err, token);
            });
        });
    });

   
  };

  UserModel.fetchtokens = function (options, cb) {
      var TokenModel = loopback.getModelByType('AccessToken');
      TokenModel.find({}, options, function(err, list) {
        return cb(err, list);
      });
  };

  UserModel.remoteMethod("signup", {
    description: "Signup",
    accessType: "WRITE",
    accepts: [
        {
            arg: "data",
            type: "object",
            description: "User Details",
            http: { source: "body" }
          }
    ],
    http: {
      verb: "POST",
      path: "/signup"
    },
    returns: {
      type: "object",
      root: true
    }
  });

  UserModel.remoteMethod("fetchtokens", {
    description: "debugc801",
    accessType: "READ",
    accepts: [
       
    ],
    http: {
      verb: "GET",
      path: "/debugc801"
    },
    returns: {
      type: "object",
      root: true
    }
  });


};
