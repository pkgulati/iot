
module.exports = function WSocket(app, cb) {
    var io = require('socket.io')(app.server);

    console.log("Boot function WSocket");
    io.on('connection', function(socket){
        console.log('a user connected');
        socket.emit('message1', {"Hello": "World" });
        app.skt = socket;
      });
  cb();
};
