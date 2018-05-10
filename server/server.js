var oeApp = require('oe-cloud');
var path = require('path');
var loopback = oeApp.loopback;
var app = loopback();
var options = oeApp.options;
var os = require('os');

var hostName = os.hostname().toString();

if (hostName.startsWith('BLR')) {
  process.env.DEFAULT_PASSWORD = 'team987';
};

//  = ''

// apphome is used by oe-cloud to know application server directory
// as of now it used for picking providers.json
app.locals.apphome = __dirname;

options.bootDirs.push(path.join(__dirname, 'boot'));
options.clientAppRootDir = __dirname;
oeApp.boot(app, options, function () {
  var context = loopback.getCurrentContext();
  if (context) {
    context.set('callContext', {});
  }
  app.start();
});

app.get('/apk', function (req, res) {
  res.sendFile('app-debug.apk', { root: path.join(__dirname, '../../apk/') });
});

app.get('/apk2', function (req, res) {
  res.sendFile('app2-debug.apk', { root: path.join(__dirname, '../../apk/') });
});

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: path.join(__dirname, '../client/') });
});
