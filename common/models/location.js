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
			var socket = Location.app.skt;
			socket.emit('message1', ctx.instance);
		}
		next();
	});
}
