var oeApp = require("oe-cloud");
var path = require("path");
var loopback = oeApp.loopback;
var app = loopback();
var options = oeApp.options;
var os = require("os");
var helmet = require("helmet");

var hostName = os.hostname().toString();

if (hostName.startsWith("BLR")) {
  process.env.DEFAULT_PASSWORD = "team987";
}

//  = ''

// apphome is used by oe-cloud to know application server directory
// as of now it used for picking providers.json
app.locals.apphome = __dirname;

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", "iot.kpraveen.in", "evsocial.evoncloud.com"]
    }
  })
);

var sixtyDaysInSeconds = 5184000;
app.use(
  helmet.hsts({
    maxAge: sixtyDaysInSeconds,
    includeSubdomains: true
  })
);

// location is old
// so send FCM
// 


app.use(helmet.noSniff());

function timerActivity() {
  console.log("timer activity");
  var UserInfoModel = loopback.getModelByType("UserInfo");
  var now = new Date();   
  var ONE_HOUR = 3600*1000; 
  var TWO_MINUTE = 120000;
  var TEN_MINUTES = 360*1000;
  var cutOff =  Date.now() - TEN_MINUTES;
  var filter = {
    where : {
      lastLocationTime: {lt: Date.now() - ONE_HOUR}
     ,lastStatusRequestTime : {lt:cutOff}
  }};
  // lastStatusRequestTime : {gt:Date.now - TWO_MINUTE}
  UserInfoModel.find(filter, options, function(err, list) {
      console.log('list length ', list.length);
      list.forEach(function(userInfo) {
      //var ist = moment(userInfo.lastLocationTime).tz("Asia/Calcutta");
      //console.log("Check on ", ist.format().substr(11, 8));
      console.log("name ", userInfo.name);
      console.log("lastStatusRequestTime ", userInfo.lastStatusRequestTime);
      
      // var age = now.getTime() - userInfo.lastLocationTime;
      // var ageInMinutes = Math.round(age / 60000);
      // console.log('Age of location', ageInMinutes, 'minutes');
      // var requestAge = now.getTime() - (userInfo.lastStatusRequestTime || 0);
      // requestAge = requestAge / 60000;
      // if (ageInMinutes > 60 && requestAge > 5) {
      //     console.log('more than 1 hour');
      //     console.log('instance ', userInfo.toJSON());
      //     // send request and update 
      //     userInfo.updateAttributes({'lastStatusRequestTime': now.getTime()}, options, function(err, updrec) {
      //         console.log('lastStatusRequestTime updated ', err);
      //     });
      // }
    });
  });
}

options.bootDirs.push(path.join(__dirname, "boot"));
options.clientAppRootDir = __dirname;
oeApp.boot(app, options, function() {
  var context = loopback.getCurrentContext();
  if (context) {
    context.set("callContext", {});
  }
  console.log("boot done");

  // For testing one minute
  var TIMER_INTERVAL = 10000;
  var FIVE_MINUTE = 300000;

  timerActivity();

  // app.start();
});
