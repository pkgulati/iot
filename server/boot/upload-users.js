var loopback = require('loopback');
var async = require('async');

module.exports = function (app) {

    var User = loopback.getModelByType('BaseUser');
   
    var context = {
        ctx: {
          tenantId: 'default'
        }
    };

    var password = process.env.DEFAULT_PASSWORD;
    if (!password) {
        console.log('You must set env DEFAULT_PASSWORD ');
        process.exit(1);
    }

    var users = [{
            username: 'Ajith',
            email: 'ajith@iot.ajith.com',
            password: password,
            team : 'oecloud',
            image : '/images/Ajith.jpg'
        },
        {
            username: 'Arun',
            email: 'arun@iot.ajith.com',
            password: password,
            team : 'oecloud',
            image : '/images/Arun.jpg'
        },
        {
            username: 'Rohit',
            email: 'rohit@iot.ajith.com',
            password: password,
            team : 'oecloud',
            image : '/images/Arun.jpg'
        },
        {
            username: 'Atul',
            email: 'atul@iot.ajith.com',
            password: password,
            team : 'oecloud',
            image : '/images/Atul.jpg'
        },
        {
            username: 'Praveen',
            email: 'praveen@iot.ajith.com',
            password: password,
            team : 'oecloud',
            image : '/images/Praveen.jpg'
        },
        {
            username: 'Shashi',
            email: 'shashi@iot.ajith.com',
            password: password,
            image : '/documents/images/Shashi.jpg'
        },
        {
            username: 'Anirudh',
            email: 'anirudh@iot.ajith.com',
            password: password,
            image : '/documents/images/Anirudh.jpg'
        }
    ];
    
    async.mapSeries(users, function(user, cb){
        User.findOrCreate({where:{username:user.username}}, user, context, function(err, dbuser, isNew){
            cb();
        });
    });

};
