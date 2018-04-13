var contactUserIds = ["us1", "us2"];
var loc = {
    "name": "ajith",
    "latitude": 12.8497239,
    "longitude": 77.6658435,
    "accuracy": 27.093000411987305,
    "id": "5acd8bce50c84ff6503f97a5",
    "time": 1523420109,
    "type": "app88",
    "formattedTime": "2018-04-11T09:45:09+0530",
    "username": "ajith"
  };
var d = new Date(loc.formattedTime);
console.log('date from 2018-04-11T09:45:09+0530', d);

var e = new Date(1523590388916);

console.log('date from millis 1523590388916 ', e.toJSON());

contactUserIds.forEach(function(item){
    console.log('contactUserId ', item);
});
