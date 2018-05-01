var date1 = new Date();
var moment = require('moment-timezone');

var jun = moment(date1).tz('Asia/Calcutta');

console.log(jun.format().substr(11,8));
