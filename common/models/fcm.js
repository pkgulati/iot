var admin = require("firebase-admin");
var path = require("path");

module.exports = function(FCM) {
  var serviceKeyPath = path.join(
    process.env.HOME,
    "fcmkey/serviceAccountKey.json"
  );
  console.log(serviceKeyPath);

  var serviceAccount = require(serviceKeyPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: "myteam-8d547",
    databaseURL: "https://myteam-8d547.firebaseio.com"
  });

  console.log(admin.app().name);

  FCM.push = function(data, options, cb) {
    var registrationToken =
      "fdNtFqRlQDE:APA91bHoiv6Ubp8nQ6sSl1Iu7raDznLfK9kpQ_QtwhguHpKISvoQGF2ImS1SKciYzAjHk635onR0DjqP5kiAUvt-al019LgbhXAgWknHsQ6h9bpmgvgkYBTMF8PoXB5eIb-yjcs3dyE5";
    // See documentation on defining a message payload.
    var message = {
      notification: {
        title: "Portugal vs. Denmark",
        body: "great match!"
      },
      data: {
        score: "850",
        time: "2:45"
      },
      token: registrationToken
    };

    admin
      .messaging()
      .send(message)
      .then(response => {
        // Response is a message ID string.
        console.log("Successfully sent message:", response);
      })
      .catch(error => {
        console.log("Error sending message:", error);
      });

    // Send a message to the device corresponding to the provided
    // registration token.
    // admin.messaging().send(message, function(error, response) {
    //   if (error) {
    //     console.log("Error sending message:", error);
    //   } else {
    //     console.log("Successfully sent message:", response);
    //   }
    //   cb(error, response);
    // });
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
