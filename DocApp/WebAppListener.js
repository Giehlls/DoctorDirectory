'use strict';
var app = require('express')(),
proxy = require('http-proxy-middleware'),
bodyParser = require('body-parser'),
fileUpload = require('express-fileupload'),
NotificationCtrl = require('./NotificationCtrl.js'),
http = require('http'),

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.all('/*', function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "X-Requested-With");
next();
});

}
// -> -> -> START NOTIFICATION FUNCTIONS -> -> ->
app.post('/notifications/setRegistration', NotificationCtrl.writeNotification_provider);
app.post('/notifications/EndorserNotification', NotificationCtrl.writeNotification_endorser);
app.post('/notifications/updateNotify, NotificationCtrl.writeNotification_update);
// <- <- <- END NOTIFICATION FUNCTIONS <- <- <-

//Run Webapp on 5050
var port = 5050;
http.createServer(app).listen(port);
console.log("WebApp running at "+port);
