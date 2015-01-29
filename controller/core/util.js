var $, G, app,
    //diction
    noun, verb, oD;
var redis = require('then-redis'),
    db = redis.createClient();
 
var emoji = require('../emoji/main.js');
    
var ut = {
    trim: function(str){
        return $.trimAll(str).replace(/\'([sdm(ll)])/g, '$1');
    },
    isEqual: function(a,b){
        return a == b;
    },
    isSimilar: function(type, a,b, aList, bList, aIndex, bIndex){
        var rs = false;
        a == b ? rs = true : '';

        var aSimilarWordsList = G[type][a] && G[type][a].similar;

        aSimilarWordsList ? ($.inArray(b, aSimilarWordsList) ? rs = true : '') : '';

        //如果a和b相似，那么检测是否是符合连续检测
        //对于名词，物主代词-->形容词--名词
        if(rs && type == 'noun' && aList){
            //如果a和b是相同物主代词，那么检测下一个是否是名词
            if(a in G['adjPronoun']){
                var aNextWord = aList[aIndex+1],
                    bNextWord = bList[bIndex+1];
                //如果下一个词是名词
                if(aNextWord in G['noun'] && bNextWord in G['noun']){
                    return ut.isSimilar('noun', aNextWord, bNextWord);
                }
            }
        }

        return rs;

        
    },
    filter: function(str, tar){
        var tar = tar || '';
        var reg = /((what|where|which|who|how)((\'s)|(\sis\s)|(\swas\s)|(\'re)|(\sare\s)|(\'re)|(\swere\s)|(\'m)|(\sam\s)?)|(\'ll)|(\swill\s)|(\'d)|(\swould\s))/g;
        return str.replace(reg, tar);
    },
    listCompare: function(list,op,a){
        // $.each
    },
    save: function(){
        db.set('wordsDict', JSON.stringify(G.wordsDict));
        db.set('ansDict', JSON.stringify(G.ansDict));
        db.set('context', JSON.stringify(G.context));
        console.log('>> Redis save succeed!')
    },
    get: function(what, cb){
        return db.get(what)
        .then(function(rs){
            cb ? cb(JSON.parse(rs)) : '';
            app.dbClient.quit();
        });
    },
    ansFormat: function (obj){
        if(obj.emoji){
           obj.data = emoji.get(obj.emoji)+obj.data; 
        }
        return obj;
    }
    
};

ut.init = function($_,G_, app_){
    $ = $_;
    G = G_;
    app = app_;
}
module.exports = ut;
