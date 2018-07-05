var moment = require("moment-timezone");

module.exports = function(SMS) {

  SMS.observe("before save", function(ctx, next) {
    if (ctx.isNewInstance && ctx.instance) {
      ctx.instance.created = new Date();
      ctx.instance.userId = ctx.instance.userId || ctx.options.ctx.userId;
      ctx.instance.name = ctx.instance.name || ctx.options.ctx.username;
      ctx.instance.createdBy = ctx.options.ctx.userId;
    }
    next();
  });

  SMS.observe("after save", function(ctx, next) {
    next();

    if (!ctx.isNewInstance) {
      return;
    }
    if (!ctx.instance) {
      return;
    }

    //var SwipeData = loopback.getModelByType('SwipeData');

    var message = ctx.instance.text;
    var pos = message.indexOf("Punched on: ");
    if (pos >= 0 && message.length > pos + 23) {
        var year = message.substring(pos + 18, pos + 22);
        var month = message.substring(pos + 15, pos + 17);
        month = month - 1;
        var day = message.substring(pos + 12, pos + 14);
        var hour = message.substring(pos + 27, pos + 29);
        var mins = message.substring(pos + 30, pos + 32);
        var swipeTime = new Date(year, month, day, hour, mins, 0);
        console.log("Punched on", swipeTime);   
        
    } else {
        console.log("Punched on: missing");
    }
  });

};
