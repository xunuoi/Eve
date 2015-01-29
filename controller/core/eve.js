/**
 * @author cloud
 * xwlxyjk@gmail.com
 * for the Eve AI
 */
/**
 * var strict
 * @param  {[String]} sVar
 * @param  {[Boolean]} bVar
 * @param  {[Number]} nVar
 */

var LD = require('../lib/LD.js'),
    $ = require('../lib/stone.js'),
    ut = require('./util.js'),
    // robert = require('../lib/robert/main.js'),
    emoji = require('../emoji/main.js'),
    // exercise = require('./exercise.js'),
    //social map
    social = require('./social.js'),
    //生存评估
    LE = require('../lib/LE.js'),
    //名词库
    noun = require('../dict/noun.js'),
    //动词库
    verb  = require('../dict/verb.js'),
    //辅助性其他词库
    oD = require('../dict/oDict.js'),
    //
    Task = require('./task'),
    //EXPORTED TO GLOBAL 
    G = {
        adj: oD.adj,
        adjPronoun: oD.adjPronoun,
        verb: verb.dict,
        noun: noun.dict
    },
    Context = require('./context'),
    app;


/**
 * check if is similar meaning
 * @param  {[type]} a [new]
 * @param  {[type]} b [old]
 * @description : 两个语句进行语义辨析，如果相同动词，但是名词不同，
 * 那么仍然属于不同语义，如果相同名词，但动词不通，同样属于不同语义；
 * 局限是名词词库和动词词库不足
 */

function checkMeaning(a, b){
    function filterStopWord(str){
        return str.replace(/\s(to|a|an|the|for|)\s/g).replace(/^\b(shall|do|did|were|was|is|are|)\s/g, '');
    }
    //remove the stop word; goodsentence goodlist
    var gs_0 = filterStopWord(a),
        gl_0 = gs_0.split(/\s/g),

        gs_1 = filterStopWord(b),
        gl_1 = gs_1.split(/\s/g);
    // console.log(gl_0, gl_1);
        //默认是同义，无异义
    var rs = true,
        //是否已发现名词异义现象,默认false，代表无异义，同义
        hasDiff_noun = false,
        //是否已发现动词异义现象，默认pt为false代表同义
        hasDiff_verb = false,
        //是否存在相同的verb
        bExistSameVerb = false,
        //是否存在相同的noun
        bExistSameNoun = false;
    // console.log(word, verb.dict);
    //以gl_0为基准俩拆解
    $.each(gl_0,function(i, word){
        //check if exist the same same verb and then compare the noun
        //这儿会有很大限制，有可能单词不知道，没入库
        //没有入库的名词或者动词，就完全按照LD来计算了
        if(word in verb.dict && $.inArray(word,gl_1)){
            bExistSameVerb = true;
            //具有相同动词，那么判断后接的名词是否相同，如果不同，那么语义不同
            var noun_0_index = i+1,
                noun_0 = gl_0[noun_0_index],
                noun_1_index = gl_1.indexOf(word)+1,
                noun_1 = gl_1[noun_1_index];
            //如果isEqual为true,那么无异义，false,那么有异义，hasDiff_noun = true;
            //
            if(hasDiff_noun === false)
                hasDiff_noun = !ut.isSimilar('noun', noun_0, noun_1, gl_0, gl_1, noun_0_index, noun_1_index);
            
            // console.log('*noun:: ',noun_0, noun_1)
            // console.log('hasDiff_noun: ', hasDiff_noun)
        }
        //has bug检测具有相同名词，那么判断前面的动词是否相同
        if(word in noun.dict && $.inArray(word, gl_1)){
            bExistSameNoun = true;

            var verb_0_index = i-1;
                verb_0 = gl_0[verb_0_index],
                verb_1_index = gl_1.indexOf(word) - 1,
                verb_1 = gl_1[verb_1_index];

            if(hasDiff_verb === false)
                hasDiff_verb = !ut.isSimilar('verb', verb_0, verb_1);
            
            // console.log('*verb:: ',verb_0, verb_1);
            // console.log('hasDiff_verb: ', hasDiff_verb);
        }
        //物主代词
        if(word in oD.adjPronoun && $.inArray(word, gl_1)){
            //解析下一个，是否是名词
            //具有相同动词，那么判断后接的名词是否相同，如果不同，那么语义不同
            var noun_0_index = i+1,
                noun_0 = gl_0[noun_0_index],
                noun_1_index = gl_1.indexOf(word)+1,
                noun_1 = gl_1[noun_1_index];
            //如果isEqual为true,那么无异义，false,那么有异义，hasDiff_noun = true;
            //
            if(hasDiff_noun === false)
                hasDiff_noun = !ut.isSimilar('noun', noun_0, noun_1, gl_0, gl_1, noun_0_index, noun_1_index);
            
            // console.log('*adjPronoun:: ',noun_0, noun_1)
            // console.log('hasDiff_noun: ', hasDiff_noun)

        }

    });
    //如果存在异义现象，那么rs为false，pt为true代表有同义
    //
    // console.log('diff pt ::: ', hasDiff_verb, hasDiff_noun);
    //如果2个pt检测都同义，那么表示为同义，rs=true,否则rs=true;
    //或者说，有一个pt为异义，那么rs 为false
    if(hasDiff_verb || hasDiff_noun){
        rs = false;
    }
    // console.log('!!!->bMeaningSimilar: ', rs)
    return rs;
}

function supplySubject(str){
    //if the first word is a verb,then supply the subject : I
    var list = str.split(/\s/g),
        firstW = list[0];
    if(firstW in verb.dict){
        //first is verb ,add I
        return 'i '+str;
    }else {
        return str;//保持不变
    }
}
/**
 * Core Learn ==============================
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
function learn (str) {
    var lesson = str.split('::'),
        a = lesson[0].toLocaleLowerCase(),//提问
        b = lesson[1];//回答

    a = supplySubject(a);
    //如果 b is a list ,means lean by multi
    //递归执行
    if(b.match(/^\[/)){
        var bList = b.replace(/(^\[)|(]$)/g, '').split('||');
        // console.log(bList);
        // return;
        $.each(bList, function(_a, _b){
            learn(a+'::'+_b);
        });
        //结束批量学习，否则后面会执行
        return;
    }
    //设立新的项目、归类到新的项目
    $.each(G.wordsDict, function  (k, v) {
        var sPercent = LD.getLdPercent(a, k),
            //是否语义不同
            bMeaningSimilar = checkMeaning(a, k);

        var tarAnsList = G.ansDict[k];
        //如果语义无抵触，且相似性达到0.6，那么归类为同一组
        if(bMeaningSimilar && sPercent >= 0.6){
            //将提问归类
            !$.inArray(a, v) ? v.push(a) : '' ;
            //将回答归类
            !$.inArray(b, tarAnsList) ? tarAnsList.push(b) : '';
            //牵引到相同数组；
            G.wordsDict[a] = G.wordsDict[k];
            //牵引到相同ans数组
            G.ansDict[a] = tarAnsList;
        }
        //存为新的项目
    });
    //如果没有归类，是一个新的语句，那么建立新的索引
    if(!G.ansDict[a]){
        G.wordsDict[a] = [a];
        G.ansDict[a] = [b];
    }
    ut.save();
    //返回学习成功的提示
    return ut.ansFormat({
        status: 101,
        message: 'OK',
        data: 'Thanks, I got it.',
        emoji: 'yeah'

    });
 /*   $.log('=== *** === *** ===');
    $.log('wordDict: ', G.wordsDict);
    $.log('G.ansDict: ', G.ansDict);*/
    // return G.ansDict;

}

/**
 * Core Define Answer
 * @param  {[type]} a [description]
 * @return {[type]}   [description]
 */
function answer (a) {
    if(!a){
        return ut.ansFormat({
            status: 7,
            message: 'failed',
            data: 'Sorry, please input something, it\'s not good to keep empty',
            emoji: 'dance'
        });
    }
    a = a.toLocaleLowerCase();
    var ccStatus = Context.cache(a);
    if(ccStatus !== true){
        //准备清除记忆
        Task.preClearContextCache();

        return ut.ansFormat(ccStatus);

    }else {
        //go on;
    }
    var ans = G.ansDict[a];
    // console.log(G.ansDict)
    if(ans) {
        // console.log(ans);
        //如果存在，返回随机回答
        var len = ans.length,
            limit = Math.floor((Math.random()*10)%len);
        return ut.ansFormat({
                status: 1,
                message: 'succeed',
                data: ans[limit]
            });

    }else {
        //不存在，那么寻找最大近似值

        $.each(G.wordsDict, function  (k, v) {
            var filtered_a = ut.filter(a),
                filtered_k = ut.filter(k);

            // var bMeaningSimilar = checkMeaning(a, k);
            var bMeaningSimilar = checkMeaning(filtered_a, filtered_k);
            // console.log(bMeaningSimilar);
            //如果语义无异义，那么按照LD来计算
            if(bMeaningSimilar){
                var sPercent = LD.getLdPercent(a, k),
                    //裁切空格之后的
                    trimedPercent = LD.getLdPercent(ut.trim(a), ut.trim(k)),
                    filteredPercent = LD.getLdPercent(filtered_a, filtered_k);

                //如果相似性达到0.6，那么归类为同一组
                if(sPercent >= 0.6 || trimedPercent >= 0.6 || filteredPercent >= 0.6){
                    v.push(a);//将提问归类
                    G.ansDict[a] = G.ansDict[k];
                }
            }
            //存为新的项目
        });
        //是否找到最大匹配
        if(G.ansDict[a]){
            return answer(a);
            
            // return answer(a);
        }else {
            return ut.ansFormat({
                status: 2,
                message: 'failed',
                data: 'Sorry, I can\'t answer you. Can you <a class="f-blue" href="javascript:;">teach me</a> by the format of <i class="f-red">Q::A</i> ?',
                emoji: 'shy'
            });

        }
    }

    ut.save();

    // $.log('=== *** === *** ===');

    // $.log(G.wordsDict);
    // $.log(G.ansDict);
}
//main worker ===================
exports.init = function(app){
    ut.init($, G, app);
    Context.init(G);
    Task.init(G);

    //Set Init Params ====================
    
    ut.get('wordsDict', function(rs){
        G.wordsDict = rs || {};
        // console.log('G.wordDict', rs);
    });//问答字典
    ut.get('ansDict',function(rs){
        G.ansDict = rs || {};
        // console.log('G.ansDict',rs);
    });//问答字典
    ut.get('context', function(rs){
        G.context = Context.create(rs);//new Context(rs);
        // console.log('G.context',rs);
    });//问答字典

    console.log('>>Eve Init Succeed!')
};

//exports api define ==============
exports.learn = learn;
exports.answer = answer;
exports.util = ut;

