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
            username: 'ajith',
            email: 'ajith@iot.ajith.com',
            password: password,
            team : 'oecloud',
            image : '/images/Ajith.jpg'
        },
        {
            username: 'arun',
            email: 'arun@iot.ajith.com',
            password: password,
            team : 'oecloud',
            image : '/images/Arun.jpg'
        },
        {
            username: 'rohit',
            email: 'rohit@iot.ajith.com',
            password: password,
            team : 'oecloud',
            image : '/images/Arun.jpg'
        },
        {
            username: 'atul',
            email: 'atul@iot.ajith.com',
            password: password,
            team : 'oecloud',
            image : '/images/Atul.jpg'
        },
        {
            username: 'praveen',
            email: 'praveen@iot.ajith.com',
            password: password,
            team : 'oecloud',
            image : '/images/Praveen.jpg'
        },
        {
            username: 'shashi',
            email: 'shashi@iot.ajith.com',
            password: password,
            image : '/documents/images/Shashi.jpg'
        },
        {
            username: 'anirudh',
            email: 'anirudh@iot.ajith.com',
            password: password,
            image : '/documents/images/Anirudh.jpg'
        },
        {
            username: 'komal',
            email: 'komal@iot.ajith.com',
            password: password,
            image : '/documents/images/Komal.jpg'
        }
    ];
    
    async.mapSeries(users, function(user, cb){
        User.findOrCreate({where:{username:user.username}}, user, context, function(err, dbuser, isNew){
            cb();
        });
    });

};
