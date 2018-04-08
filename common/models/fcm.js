var admin = require("firebase-admin");
var path = require("path");

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
    
    admin
    .messaging()
    .send(message)
    .then(function(response) {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
      cb(null, response);
    },
    function(error){
      console.log("Error sent message:", error);
      cb(error, null);
    })
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
};
