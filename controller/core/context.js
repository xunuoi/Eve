/**
 * Context Define ===============================
 * @param {[type]} c [description]
 */
var G;
function Context(c){
    c ? '' : c = {};

    this.dict = c.dict || {};
    this.sequentRecord = c.sequentRecord || {};
    this.last = c.last || null;
    this.history = c.history || [];
}
Context.prototype.clear = function(lastKey){
    this.history = [];
    lastKey ? this.last = lastKey : this.last = null;
    this.sequentRecord = {};
    this.dict = {};
}

/**
 * Core Context Calculate
 */
//记录上下文历史
function cacheContext(key){
    //key是当前；
    var cc = G.context,
        historyLen = cc.history.length;

    cc.history.push(key);
    //如果未存在过，那么进入新纪录的历史队列
    if(cc.dict[key] === undefined){
        cc.dict[key] = historyLen;//记录在history中的坐标
        cc.sequentRecord = {};
        cc.sequentRecord[key] = 1;

        cc.last = key;
    //如果已经获取过一次
    }else {
        //如果与上一个重复
        if(cc.last == key){
            cc.sequentRecord[key]++;
        }else {
        //否则重新设置连续计数器
            cc.sequentRecord = {};
            cc.sequentRecord[key] = 1;
            cc.last = key;
        }
    }
    // console.log(cc.sequentRecord);
    if(cc.sequentRecord[key] >= 6){
        return {
            status: 3,
            message: 'pause',
            data: '',
            emoji: 'crazy'
        };
    }else if(cc.sequentRecord[key] >= 5){
        return {
            status: 3,
            message: 'pause',
            data: 'What a bored man! Just shut up,body',
            emoji: 'bored'
        };
    }else if(cc.sequentRecord[key] >= 4){
        
        return {
            status: 3,
            message: 'pause',
            data: 'Is it a lot of fun to say one again by again ？',
            emoji: 'cute'
        };
    }else {
        return true;
    }
    // cc.last = key;
}
exports.init = function (G_) {
    G = G_;
}
exports.cache = cacheContext;
exports.create = function(foo){
    return new Context(foo);
}
