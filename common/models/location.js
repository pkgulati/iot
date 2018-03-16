module.exports = function locFn(Location) {
	Location.observe('before save', function locBeforeSaveFn(ctx, next) {
		if(ctx.instance && ctx.instance.loc) {
			coords = (ctx.instance.loc).split(",");
			ctx.instance.latitude = Number(coords[0]);
			ctx.instance.longitude = Number(coords[1]);
			ctx.instance.loc = undefined;
		}
		next();
	});


	Location.observe('after save', function locAfterSaveFn(ctx, next) {
		if(ctx.instance) {
			console.log("Location after save: sending data", JSON.stringify(ctx.instance));
			var sockets = Location.app.skts;
			sockets.forEach(function(socket) {
				socket.emit('message1', ctx.instance);
			});
			
		}
		next();
	});

	Location.remoteMethod('loc', {
		description: 'Sets new location from a Google Maps URL',
		accessType: 'READ',
		accepts: [{
		  arg: 'url',
		  type: 'string',
		  description: 'url',
		  http: {
			source: 'query'
		  }
		}
		],
		http: {
		  verb: 'GET',
		  path: '/loc'
		},
		returns: {
		  type: 'object',
		  root: true
		}
	  });


	  Location.loc = function loc(url, options, cb) {
		var data = {};
		if (!cb && typeof options === 'function') {
		  cb = options;
		  options = {};
		}
		var firstIndexOfComma = url.indexOf(",", url.indexOf("@"));
		var secondIndexOfComma = url.indexOf(",", 2 + firstIndexOfComma);
		var latlng = url.substring(1 + url.indexOf("@"), secondIndexOfComma);
		var name = url.substring(0, url.indexOf("/"));
		if(name.startsWith("http")) name = "UNNAMED";
		var lat = Number(latlng.substring(0, latlng.indexOf(',')));
		var lng = Number(latlng.substring(1 + latlng.indexOf(',')));
		var tm = new Date().getTime()/1000;
		var type = "URL";
		var data = {"time": tm, "latitude": lat, "longitude": lng, "name": name, "type": type};
		Location.upsert(data, options.ctx, function upd(err, data) {
			cb(err, data);
		  });
	  };
}
