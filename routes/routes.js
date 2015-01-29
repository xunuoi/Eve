var path = require('path');
var app;
var spider = require('../util/spider/spider');
var ut = require('../controller/core/util');

function setRoute(){

app.get('/', function(req, res) {
    res.render('index', { title: 'Hello, this is Cloud' });

});

app.get('/eve', function(req, res) {
    res.render('eve', { title: 'Hello' });
});


app.get('/message', function(req, res){
    var c = req.param('c');
        // type = req,param('type');
    var type = 'answer';
    if(c.match(/::/)){
        type = 'learn';
    }

    if(type == 'learn'){
        res.json(app.eve.learn(c)); 

    }else if(type == 'answer'){
        var rep = app.eve.answer(c);
        if(rep.status == 2){
            spider.search(c, function(rp){

                var rsAns = rp['s'][0];

                if(rp['s'][1]){
                    rsAns = rp['s'][1];
                }
                if(rsAns){
                    res.json(ut.ansFormat({
                        status: 3,
                        message: 'Got it',
                        data: 'I know this: '+rsAns,
                        emoji: 'lalala'
                    }));
                }else {
                    res.json(ut.ansFormat({
                        status: 2,
                        message: 'failed',
                        data: 'Sorry, I can\'t answer you. Can you <a class="f-blue" href="javascript:;">teach me</a> by the format of <i class="f-red">Q::A</i> ?',
                        emoji: 'shy'
                    }));
                }
            });
            
        }else {
            res.json(rep);
        }

    }else {
        res.json({
            'status': 300,
            'data': 'Unknow Request Type: '+type,
            'message': 'failed'
        });
    }
});

}///setRoutes

exports.init = function(app_, skt_){
    app = app_;
    skt = skt_;
    setRoute();
}