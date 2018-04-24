var admin = require("firebase-admin");
var path = require("path");
var loopback = require("loopback");

module.exports = function(FCM) {
  var serviceKeyPath = path.join(
    process.env.HOME,
    "fcmkey/serviceAccountKey.json"
  );

  var serviceAccount = require(serviceKeyPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: "myteam-8d547",
    databaseURL: "https://myteam-8d547.firebaseio.com"
  });

  FCM.push = function(message, options, cb) {
    var messageForUserId;
    if (message.data && message.data.messageForUserId) {
      messageForUserId = message.data.messageForUserId;
    }
    admin
      .messaging()
      .send(message)
      .then(
        function(response) {
          // Response is a message ID string.
          console.log("Successfully sent message:", response);
          cb(null, response);
        },
        function(error) {
          if (error.code == "messaging/registration-token-not-registered" && messageForUserId) {
              console.log("Error code ", error.code, message.token);
              var UserModel = loopback.getModelByType('User');
              UserModel.findById(messageForUserId, options, function(err, user){
              if (user) {
                  console.log("clear deviceToken from users " , user.username);
                  user.updateAttributes({deviceToken:""}, option, function(err, dbrec){
                      console.log("deviceToken cleared for ",  user.username , err, dbrec.username);
                  });
              }
            });
          }
          cb(error, null);
        }
      )
      .catch(function(error) {
        console.log("Error sending message:", error);
        cb(error, null);
      });
  };

  FCM.remoteMethod("push", {
    description: "Push the message",
    accessType: "WRITE",
    accepts: [
      {
        arg: "data",
        type: "object",
        description: "Model instance data",
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

  FCM.ulist = function(options, cb) {
    var AuthSession = loopback.getModelByType("AuthSession");
    AuthSession.find({}, options, function(err, list) {
      var result = [];
      list.forEach(function(token) {
        result.push({
          token: token.id,
          userId: token.userId,
          username: token.username
        });
      });
      cb(err, result);
    });
  };

  FCM.remoteMethod("ulist", {
    description: "for demo",
    accessType: "READ",
    accepts: [],
    http: {
      verb: "GET",
      path: "/ulist"
    },
    returns: {
      type: "object",
      root: true
    }
  });
};
