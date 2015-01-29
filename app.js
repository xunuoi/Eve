var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('es');

// var sio = require('socket.io');

var routes = require('./routes/routes');
var skt = require('./controller/core/socket');
var eve = require('./controller/core/eve');
    // ut = require('./controller/core/util');

function NodeApp(){
    var app = express(), self = this;
    self.app = app;
    self.setApp = function(){

        // uncomment after placing your favicon in /public
        app.use(favicon(__dirname + '/public/favicon.ico'));
        app.use(logger('dev'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(require('node-compass')({mode: 'expanded'}));
        // app.use(express.methodOverride());
        var workEnv = app.get('env') || 'production'//'development';

        debug('****** In '+workEnv+' Pattern******');
        
        if (workEnv === 'development') {
            
            app.set('views', path.join(__dirname, 'views'));
            app.use('/static', express.static(path.join(__dirname, '/public')));
        }else {
            app.set('views', path.join(__dirname, 'views/output'));
            //正式的使用nginx来做静态资源
            app.use('/static', express.static(path.join(__dirname, '/public/static')));
        }
        // view engine setup
        app.set('view engine', 'ejs');

        //设置静态资源文件跨域
        app.use('/static', function(req, res, next){
            var legalDomain = '*';
            res.header("Access-Control-Allow-Origin", legalDomain);
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
            next();
        });
    };
    self.setRoute = function(){

        //set routes =========================================
        routes.init(app,skt);
        
        // app.use('/', routes);
        // app.use('/users', users);    
    };
    self.setHandler = function(){
        // catch 404 and forward to error handler
        app.use(function(req, res, next) {
            var err = new Error('Page Not Found');
            err.status = 404;
            next(err);
        });
        // error handlers ==============================
        // development error handler
        // will print stacktrace
        if (app.get('env') === 'development') {
            app.use(function(err, req, res, next) {
                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    error: err
                });
            });
        }else {
            // production error handler
            // no stacktraces leaked to user
            app.use(function(err, req, res, next) {
                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    error: {}
                });
            });
        }

    };
    self.socketListen = function(server, app){
        skt.init(server, app);
    }
    self.initEve = function(){
        eve.init(app);
        app.eve = eve;
    };
    self.init = function(){
        self.setApp();
        self.setRoute();
        self.setHandler();
        // self.initDB(function(){
        self.initEve();
        // });
         
    };

    self.start = function(){
        app.set('port', process.env.PORT || 3000);

        var server = app.listen(app.get('port'), function() {
            debug('Express-Server Listening on Port ' + server.address().port);
        });
        
        // self.socketListen(server, app);
    };


}
var nApp = new NodeApp();
nApp.init();
//exports =====================================
module.exports = nApp;
