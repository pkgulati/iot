var oeApp = require("oe-cloud");
var path = require("path");
var loopback = oeApp.loopback;
var app = loopback();
var options = oeApp.options;

app.locals.apphome = __dirname;

options.bootDirs.push(path.join(__dirname, "boot"));
options.clientAppRootDir = __dirname;
oeApp.boot(app, options, function() {
  console.log("post boot");
  var UserModel = loopback.getModelByType("BaseUser");
  var userId = "5ac1f373f072f2212cd94d9e";
  var filter = {
        where : {
            id : {neq:userId}
        }
  };
  var options = {};
  options.ignoreAutoScope = true;
  options.fetchAllScopes = true;
  options.ctx = {tenantId : 'default'};
  console.log("find user from db ", filter);
  UserModel.find(filter, options, function(err, dblist) {
    console.log("filter ", JSON.stringify(filter));
    console.log("result user from db. list length ", dblist.length);
    console.log('DB Error ', err);
    console.log('db list ', dblist);
  });
});

console.log("test1.js ");
