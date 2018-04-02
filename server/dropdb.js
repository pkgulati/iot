/*jshint -W117 */
var dbs = db.getMongo().getDBNames(); /* jshint ignore:line */
for(var i in dbs){
    db = db.getMongo().getDB( dbs[i] );
    var name = db.getName();
    if (name !== 'local' && name !== 'admin') {
    	print( 'dropping db ' + db.getName() );
    	db.dropDatabase();
    }
}
