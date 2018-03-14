module.exports = function locFn(Location) {
	Location.observe('before save', function locAfterSaveFn(ctx, next) {
                console.log(Object.keys(ctx.Model));
		if(ctx.instance && ctx.instance.loc) {
			coords = (ctx.instance.loc).split(",");
			ctx.instance.latitude = Number(coords[0]);
			ctx.instance.longitude = Number(coords[1]);
			ctx.instance.loc = undefined;
		}
		next();
	});
}
