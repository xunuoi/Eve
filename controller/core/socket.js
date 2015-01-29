var debug = require('debug')('es'),
    sio = require('socket.io');

var ut = require('./util'), eve, socket,
    spider = require('../../util/spider/spider');
 
function parseContent(data){
    var word = data.message;
    
    if(word.match(/::/)){
        //学习模式
        var rs = eve.learn(word);
        socket.emit('response', rs);
    }else {
        //回答模式
        var rep = eve.answer(data.message),
            rs = rep;

        if(rep.status == 2){
            //爬虫查找
            spider.search(word, function(rp){
                
                var rsAns = rp['s'][0];

                if(rp['s'][1]){
                    rsAns = rp['s'][1];
                }

                if(rsAns){
                    rs = ut.ansFormat({
                        status: 3,
                        message: 'Got it',
                        data: 'I know this: '+rsAns,
                        emoji: 'lalala'
                    });
                }else {
                    rs = ut.ansFormat({
                        status: 2,
                        message: 'failed',
                        data: 'Sorry, I can\'t answer you. Can you <a class="f-blue" href="javascript:;">teach me</a> by the format of <i class="f-red">Q::A</i> ?',
                        emoji: 'shy'
                    });
                }

                //emit reponse
                socket.emit('response', rs);
            });
            
        }else {
            socket.emit('response', rs);
        }
        
    }
}
exports.init = function(server, app){
    socket = sio.listen(server);
    eve = app.eve;

    //添加连接监听
    socket.on('connection', function(client){
        debug('*** >> Socket Create Succeed');
        // client.send('Send client Succeed');
        //连接成功则执行下面的监听
        client.on('message',function(data){ 
            console.log('*** Received message from client', data);
            //parse
            parseContent(data);
            
        });

        //断开连接callback
        client.on('disconnect',function(){
            debug('*** >>Server has disconnected!');
        });
    });
}