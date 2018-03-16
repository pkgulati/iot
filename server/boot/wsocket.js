module.exports = function WSocket(app, cb) {
    var sockets = [];
    var io = require('socket.io')(app.server);

    console.log("Boot function WSocket");
    io.on('connection', function(socket){
        console.log('a user connected');
        socket.emit('message1', {"Hello": "World" });
        sockets.push(socket);
    });
    app.skts = sockets;
    cb();
};
