const jwt = require('jsonwebtoken');
const logger = require('oe-logger');
const log = logger('jwt-generator');
const expiration = process.env.JWT_EXPIRATION;

var jwtOptions;
if (expiration) {
  jwtOptions = {expiresIn: expiration};
} else {
  jwtOptions = {};
}
var tokenExpiration = 0;
var accessToken;

var jwtData = {
  iss: 'mycompany.com',
  aud: 'mycompany.net'
};
if (process.env.JWT_CLIENT && process.env.JWT_CLIENT.length > 0) {
  try {
    var tempConfig = JSON.parse(process.env.JWT_CLIENT);
    jwtData = tempConfig && typeof tempConfig === 'object' ? tempConfig : jwtData;
  } catch (e) {
    log.error(log.defaultContext(), 'Could not parse JWT_CLIENT as json, service authentication will fail, error: ', e);
  }
}

module.exports = function generateJwt(payload, app, cb) {
  if (Date.now() > tokenExpiration || !!accessToken) {
    Object.keys(payload).forEach((key) => {
      jwtData[key] = payload[key];
    });
    jwtData.username = app.get('app');
    var key = process.env.SECRET_OR_PUBLIC_KEY && process.env.SECRET_OR_PUBLIC_KEY.length > 0 ? process.env.SECRET_OR_PUBLIC_KEY : 'secret';
    jwt.sign(jwtData, key, jwtOptions, function jwtSignCb(err, token) {
      if (err) {
        log.error(log.defaultContext(), 'error in siging jwt: ', err);
        return cb(err);
      }
      if (expiration) {
        tokenExpiration = Date.now() + expiration;
      }
      accessToken = token;
      return cb(null, accessToken);
    });
  } else {
    return cb(null, accessToken);
  }
};
