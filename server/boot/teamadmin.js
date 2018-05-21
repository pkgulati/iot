var loopback = require('loopback');

module.exports = function(app) {
   
    var BaseRole = app.models.BaseRole;
    BaseRole.registerResolver('teamadmin', function(role, context, cb) {
      var userId = context.accessToken.userId;
      if (!userId) {
        return process.nextTick(() => cb(null, false));
      }
      var username = context.accessToken.username;
      if (username == 'Praveen' || username == 'praveen' || username == 'ajith' || username == 'Ajith') {
        return process.nextTick(() => cb(null, true));
      }
      else {
        return process.nextTick(() => cb(null, false));
      }
    });

  };
  