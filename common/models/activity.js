var loopback = require("loopback");
var async = require('async');

module.exports = function(Activity) {

    Activity.synchronize = function(array, options, cb) {
            var results = [];
            async.forEachOf(array, function(item, index, done){
                var idx = index;
                Activity.create(item, options, function(err, dbrec){
                    results[idx] = {};
                    if (err && err.code == 11000) {
                        results[idx].error = null;
                    } else {
                        results[idx].error = err;
                    }
                    results[idx].data = dbrec ? dbrec : item;
                    done(null);
                });
            },
            function(){
                cb(null, results);
            });      
    };

    Activity.remoteMethod("synchronize", {
        description: "Synchrnozed",
        accessType: "WRITE",
        accepts: [
          {
            arg: "data",
            type: "Array",
            description: "Model instance data",
            http: { source: "body" }
          }
        ],
        http: {
          verb: "POST",
          path: "/synchronize"
        },
        returns: {
          type: "Array",
          root: true
        }
      });


  var sendMessageToUser = function(message, options, userId, next) {
    var UserModel = loopback.getModelByType("BaseUser");
    UserModel.findById(userId, options, function(err, user){
        if (err) {
            return next(err);
        }
        if (!user) {
            return(next());
        }
        var FCM = loopback.getModel("FCM");
        message.token= user.deviceToken;
        FCM.push(message, options, next);
      });
    };

  Activity.observe("before save", function(ctx, next) {
	if (ctx.isNewInstance && ctx.instance) {
		ctx.instance.created = new Date();
		ctx.instance.userId = ctx.options.ctx.userId;
		ctx.instance.name = ctx.options.ctx.username;
	}
	next();
  });

	Activity.prototype.process = function(options, cb) {
		if (this.type == "ViewContact") {
	console.log('activity ViewContact ', this);
			if (!this.contactId) {
				return cb(null);
			}
			var self = this;
			var ContactModel = loopback.getModel("Contact");
			ContactModel.findById(this.contactId, options, function(err, contact){
				if (err) {
				    return cb(err);
				}
				if (!contact) {
				    return cb();
				}
				var message = {
					android: {
    						priority : "high"
  					},
				      data : {
					type: "InformationUpdateRequest",
					activityId : self.id.toString()
				      }
				}
				sendMessageToUser(message, options, contact.contactUserId, function(err, res) {
					console.log('message sent ', err, res);
					cb(err, res);
				});
			    });
		}
		else {
			cb(null);
		}
	};

	Activity.observe("after save", function(ctx, next) {
	next();
	if (!ctx.isNewInstance) {
		return;
	}
	if (!ctx.instance) {
		return;
	}
		ctx.instance.process(ctx.options, function(err, res) {
		});
  	});
};
