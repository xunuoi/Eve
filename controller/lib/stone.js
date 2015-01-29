/* 
 * Stone.js For CommonJS HOST
 * @Cloud Xu: xwlxyjk@gmail.com
 * 2013/5/29 V1.4
 * Get The Latest Version From: 
 * https://github.com/xunuoi/xStone
 */
/* DEFINE STONE OBJECT  --------------------------------------------------------*/

var _guidBase = {},
    _autoIncrement = {};

module.exports =  {
    noop: function(){},
    _version: '1.4',
    typeCheckOff: function(){
        this.typeCheck = function(){
            return _exports;
        };
    },
    cloneArray: function (a) {
        var r = a.concat([]);
        return r;
    },
    clone: function(tar) {      
        var t = this.getType(tar), rt;      
        t == 'array' ? rt = this.cloneArray(tar) :      
        (t == 'object' ? rt = this.cloneObj(tar) :      
        (t == 'string' ? rt = tar : ''));       

        return rt;      
    },
    //return a new reversed array
    reArray: function(a){
        var b = a.concat([]).reverse()
        return b;
    },
    unique: function(list){
        var res = [], hash = {};
        for(var i=0, elem; (elem = list[i]) != null; i++)  {
            if (!hash[elem]){
                res.push(elem);
                hash[elem] = true;
            }
        }
        return res;
    },
    arrayDel: function(arr, index, ifClone){
        ifClone ? arr = stone.clone(arr) : '';
        for(var i=index, len=arr.length-1; i<len; i++){
             arr[i] = arr[i + 1];
        }
        arr.length = len;               
        return arr;
    },
    sort: function(list, sortFn, subSortFn){
        if(!sortFn) { return list.sort(); }
        else {
            //this.typeCheck(list[0], 'object');
            var listCopy = stone.clone(list),
                rsList = [],
                objList = [],
                strList = [],
                tmpObj = {};

            this.every(listCopy, function(curObj){
                var sortKey = sortFn.call(curObj, curObj);
                //console.log(sortKey)
                strList.push(sortKey);
                objList.push({
                    'key': sortKey,
                    'obj': curObj
                });
            });

            strList.sort(subSortFn);
            //console.log(strList);
            stone.every(strList, function(curKey){
                var tarObj;
                var len = objList.length
                for(var i=0; i<len; i++){
                    var obj = objList[i];
                    if(obj['key'] === curKey){
                        tarObj = obj['obj'];
                        obj['key'] = '__used_key__';
                        break;
                    }
                }

                if(tarObj){ rsList.push(tarObj);}
                else { throw Error('Unknow Error.');}
            });

            return rsList;
            
        }
    },
    listEach: function(a, eachfn){
        var len = a.length;
        var newa = [];
        for(var i=0;i<len; i++){
            newa.push(eachfn.call(a[i], i, a[i])); 
        }
        //invalid return value
        newa.length == 0 ? newa = undefined : '';
        return newa;
    },
    every: function(a, eachfn){
        var len = a.length;
        var curRs;
        for(var i=0;i<len; i++){
            curRs = eachfn.call(a[i], i, a[i]); 
        }

        return curRs;
    },

    attrEach: function(obj, fn){
        for(var key in obj){
            if(obj.hasOwnProperty(key)){
                fn.call(obj[key], key, obj[key]);
            }
        }

        return this;
    },
    each: function(obj, fn){
        //if it is list 
        if(this.getType(obj) == 'array'){
            return this.every(obj, fn);
        }
        for(var key in obj){
            if(obj.hasOwnProperty(key)){
                fn.call(obj, key, obj[key]);
            }
        }

        // return this;
    },  
    attrNum: function(obj){
        var num = 0;
        stone.attrEach(obj, function(val){
            num++;
        });
        return num;
    },

    forIn:function(obj,call1,call2){
        var len = obj.length,
            i = 0,
            fn = function(){
            if(i<len){
                call1(i,obj[i]);
                i++;
                setTimeout(function(){
                    fn();
                });
            }else{
                call2();
            }
        };
        fn();
    },
    
    forEach:function(obj,callback){
        /*
            分段遍历策略
        */
        if(!obj){
            return;
        }
        var len = obj[0].length,i;
        if(len<=6){
            /*
                普通方式
            */
            for (i=0; i < len; i++) {
                if ( callback.apply( obj[0][i],[obj[0][i],i]) === false ) {
                    break;
                }
            }
        }else{
            var fn = function(s){
                callback.apply( obj[0][s],[obj[0][s],s]);
                callback.apply( obj[0][s+1],[obj[0][s+1],s+1]);
                callback.apply( obj[0][s+2],[obj[0][s+2],s+2]);
                callback.apply( obj[0][s+3],[obj[0][s+3],s+3]);
                callback.apply( obj[0][s+4],[obj[0][s+4],s+4]);
                callback.apply( obj[0][s+5],[obj[0][s+5],s+5]);
            };
            var remainder = len % 6;
            var section = Math.floor( len / 6);
            if(section){
                i = 0;
                while(i<section){
                    fn(i*6);i++;
                }
            }
            if(remainder){
                i = len-remainder;;
                while(i<len){
                    callback.apply( obj[0][i],[obj[0][i],i]);i++;
                }
            }
        }
    },          
    isEmpty: function(tar){
        var type = this.getType(tar);
        var rs = true;
        if(type == 'object'){
            this.attrEach(tar, function(){
                rs = false; 
            });
        }else if(type == 'array'){
            this.every(tar, function(){
                rs = false;
            });
        }else if(type == 'string'){
            if(tar === ''){
                rs = true;
            }
        }else {
            throw Error('TypeError: stone.isEmpty([string/array/object])');
        }

        return rs;
    },
    toggleAttr: function(tar, attr, val){
        var val = val || attr;
        if(!tar.getAttribute(attr)){
            tar.setAttribute(attr, val);
        }else {
            tar.removeAttribute(attr);
        }

        return this;
    },
    //ONLY FOR STRING/NUMBER ARRAY
    arrayMinus: function(a, b, intersection){
        var intersection = intersection || false;
        //rs = a - b
        var tA = this.getType(a), tB = this.getType(b);
        tA == 'array' ? (tB == 'array' ? '' : (b = [].concat(b) )) : (a = [].concat(a));

        var rs = [];
        var rsI = [];
        var aLen = a.length;

        for(var i=0; i<aLen; i++){
            if(!stone.inArray(a[i], b)){ // if not in b
                rs.push(a[i]);
            }else {
                rsI.push(a[i]);
            }
        }
        if(!intersection){
            return rs;
        }else {
            return rsI;
        }
    },
    //ONLY FOR STRING/NUMBER ARRAY
    arrayUnion: function(a, b){
        //rs = a + b;
        this.typeCheck(a, 'array').typeCheck(b, 'array');
        var intersection = this.arrayMinus(a, b, true);

        return this.arrayMinus(a.concat(b), intersection).concat(intersection);
    },
    rmEmpty: function(tar){
        var len = tar.length,
            rt = [];
        for(var i=0; i<len; i++){
            var curVal = tar[i];
            curVal !== '' ? rt.push(curVal) : '';
        }
        return rt;
    },
    renderTmpl: function(tmpl ,data){
        var dataType = stone.getType(data);
        var rsHtml = tmpl;
        if(dataType == 'array'){
            var len = data.length;
            for(var i=0; i<len; i++){
                rsHtml = rsHtml.replace(/%(\{\w*\})?%/, data[i]);
            }
        }else if(dataType == 'object'){
            for(var key in data){
                if(data.hasOwnProperty(key)){
                    var valPt = new RegExp('%\\{?'+key+'\\}?%', 'g');
                    rsHtml = rsHtml.replace(valPt, data[key]);
                }
            }
        }else {throw TypeError('Invalid Type: '+dataType);}

        return rsHtml;
    },
    attr: function(tar, key, val){
        var list = [],
            rs, rtOne = false;
        tar.length ? list = tar : (list = [].concat(tar), rtOne = true);
        
        val === undefined ? rs = this.each(list, function(cur){
            return cur.getAttribute(key, val);
        }) : ( this.every(list, function(cur){
            cur.setAttribute(key, val);
        }), rtOne = false ); 
        //rs.length == 1 ?  rs = rs[0] : (rs.length == 0 ? rs = undefined : '');
        rtOne === true ? rs = rs[0] : '';

        return rs;
    },
    pureSelector: function(str){
        if(stone.inArray(str.charAt(0), ['#', '.'])){
            return str.slice(1);
        }else {
            return str;
        }
    },
    random: function(dis) {
        //like dis = [1, 10]
        var dis = dis || [0, 1];
        return parseInt(Math.random() * (dis[1] - dis[0] + 1) + dis[0])
    },
    parseObject: function(url){//translate the URL resolve to Object
        return (new Function('return' + 
        ' {' + 
              url.substring(url.indexOf('?')+1).replace(/&/g,'",').replace(/=/g,': "') +
        '" }'))();//before '}' add " for:the end parameters. eg: rs=true  ,then rs: "true ,need  "  to end this 
    },
    objToArray: function(obj){
        var list = [];
        stone.each(obj, function(){

        });
    },
    calUrl: function(base, tar){
        return base.replace(/^.\//g, '');
    },
    urlToObj: function(url){//
        return (new Function('return' + 
        ' {' + 
              url.substring(url.indexOf('?')+1).replace(/&/g,'",').replace(/=/g,': "') +
        '" }'))();
    },
    objToUrl: function(parObj,curUrlRoot){
        //this.typeCheck(parObj, 'object');
        var curUrl = curUrlRoot || '';
        for(var key in parObj) {
            if(parObj.hasOwnProperty(key)){
                curUrl = this.addURLParam(curUrl, key, parObj[key] );
            }
        }
        return curUrl;
    },
    objGetUrl: function(parObj,curUrlRoot){
        this.typeCheck(parObj, 'object');
        var curUrl = curUrlRoot || '';
        for(var key in parObj) {
            if(parObj.hasOwnProperty(key)){
                curUrl = this.addParam(curUrl, key, parObj[key] );
            }
        }
        return curUrl;
    },
    getObj: function(argObj){

        var regSymbol = '^$.*+?=!:|\/()[]{}';

        var s = argObj.string,
            a = argObj.linker,
            b = argObj.separator;
        if(s == undefined || s == null || s == '' || s == 'undefined' || s == 'null'){
            throw new TypeError('Invalid String : ' + s + ' ,Please Check !' );
        }

        if(regSymbol.indexOf(a) != -1){
            a = '\\'+a;
        }
        if(regSymbol.indexOf(b) != -1){
            b = '\\'+b;
        }   
        //console.log('return {"' + s.replace(new RegExp(b, 'g'), '",').replace(new RegExp(a, 'g'), '": "') + '" }');
        return (new Function('return {"' + s.replace(new RegExp(b, 'g'), '", "').replace(new RegExp(a, 'g'), '": "') + '" }'))();           
    },

    resolveJSON: function(obj){
        this.typeCheck(obj,'object');
        var str = '';
        for(var i in obj){
            str += ( i + '=' + encodeURIComponent(obj[i]) + '&' );  

        }
        str = str.slice(0,-1);
        return str;

    },

    trim: function(str){
        return str.replace(/(^\s*)|(\s*$)/g, '');
    },
    trimAll: function(str){
        return str.replace(/\s/g, '');
    },
    //For String Util
    //use for mixed with english words and chinese words
    subMixstr : function(str, cutLen){
       //resolve to array
        var pt = /[^\x00-\xff]/,temp = [],rs=[];
        if ( !pt.test(str))  return str.substring(0,len-1);
        else {
           for(var i=0, len = str.length; i<len; i++){
               pt.test(str[i]) ? temp.push([str[i],2]) : temp.push([str[i],1]);
           }
        }
        for(var p =0,lenCounter = 0; p<len; p++){
          var tStr = temp[p][0];
          rs.push(tStr);
          if( (lenCounter+=temp[p][1]) >= cutLen ){return rs.join('');}
        }
    },
    HTMLEncode: function (str) { 
        var s = ""; 
        if(str.length == 0) {return "";}
        s = str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")./*replace(/ /g, "&nbsp;").*/replace(/\'/g, "'").replace(/\"/g, "&quot;").replace(/<br>/g, "\n").replace(/<br \/>/g, "\n").replace(/<br\/>/g, "\n")//.replace(/\n/g, "<br />");   
        return s;
    },
    HTMLDecode: function(str) {
        //by jquery >>> var decoded = $(“<div/>”).html(encodedStr).text();
        var s = ""; 
        if(str.length == 0) {return ""; }
            s = str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/'/g, "\'").replace(/&quot;/g, '\"').replace(/\n/g, "<br />")/*.replace(/<br>/g, "\n").replace(/<br \/>/g, "\n").replace(/<br\/>/g, "\n")*/;  
        return s; 
    },
    compareDate: function(a,b){ //for yyyy-mm-dd
        var arr = a.split('-'),
            starttime = new Date(arr[0],arr[1],arr[2]),
            startTimes = starttime.getTime();//
            
        var arr2 = b.split('-'),
            lktime = new Date(arr2[0],arr2[1],arr2[2]),
            lkTimes = lktime.getTime();
            
        if(startTimes >= lkTimes) { return false;}
        else {return true;}
            
    },
    now: function(){
        return (new Date()).getTime();
    },  
    getCHTime: function () { //get the Chinese-format time
        var now = new Date();
       
        var year = now.getFullYear();       //year
        var month = now.getMonth() + 1;     //month
        var day = now.getDate();            //day
       
        var hh = now.getHours();            //hour
        var mm = now.getMinutes();          //minute
       
        var clock = year + "-";             //clock the final time show
       
        if(month < 10){
           clock += "0";
         }
           clock += month + "-";
        
        if(day < 10){
           clock += "0";
          }   
          clock += day + " ";
        
        if(hh < 10){
          clock += "0";
         }   
          clock += hh + ":";
        
        if (mm < 10) {
          clock += '0'; 
        }
          clock += mm; 
        
        return(clock); 
    },
    getCHDate:function(){
        return this.getCHTime().slice(0,10);
    },
    classOf: function(o,note){
              if (o === null) return 'Null';
              if( o === undefined) return 'Undefined';
              if( !note ) return Object.prototype.toString.call(o).slice(8,-1);
              if(note) return Object.prototype.toString.call(o);
    },//classOf
    typeCheck: function(obj,type,mes){
        var errorMes = 'TyperError';
        if(this.classOf(obj) == 'Array'){//if check a package of targets in a Array
            if(typeof arguments[1] == 'string' ) {
                var obj = [ [obj, arguments[1]] ];
            }
            for(var p = 0, len = obj.length; p < len; p++){
                if(obj[p][1].toLowerCase() == 'array'){
                    if( this.classOf(obj[p][0]).toLowerCase() != 'array'){
                            errorMes = mes || 'The Parameter Type Expected to be '+obj[p][1]+' But got '+this.classOf(obj[p][0]);
                            throw new TypeError(errorMes);
                    }
                }
                else if (typeof obj[p][0] != obj[p][1] ){
                    errorMes = mes || 'The Parameter Type Expected to be '+obj[p][1]+' But got '+(typeof obj[p][0]) ;
                    throw new TypeError(errorMes);
                }

            }
            return this;//ok
        }

        else if(typeof obj != type) {//other type check
            errorMes = mes || 'The Parameter Type Expected to be '+type+' But got '+(typeof obj) ;
            throw new TypeError(errorMes);

        }
        return this;//ok

    },//typeCheck

    getType: function(t){
        var cur = this.classOf(t).toLowerCase();
        return cur;
    },
    
    typeIn: function(tar, ts){
        var curType = this.classOf(tar).toLowerCase();
        return this.inArray(curType, ts);
    },
    classIn: function(tar, ts){
        var curType = this.classOf(tar);
        return this.inArray(curType, ts);       
    },

    validate: function(tar, type){
        //stone.typeCheck([[type, 'string'], [tar, 'string'] ]);
        
        switch(type) {

            case 'number':
                return _number_pt = /^\d+(\.\d+)?$/.test(tar);
            case 'integer':
                var _integer_pt = /^(-|\+)?\d+$/ ;
                return _integer_pt.test(tar);

            case 'mail':
                //MAIL : "^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$",
                var _email_pt = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
                return _email_pt.test(tar);

            case 'tel':
                //TEL : "^0(10|2[0-5789]|\\d{3})-\\d{7,8}$",
                var _tel_pt = /^[0-9]{3,4}(\-|\s)[0-9]{7,8}$/;
                return _tel_pt.test(tar);
            case 'mobile':
                var _mobile_pt = new RegExp('^1(3[0-9]|5[0-35-9]|8[0235-9])\\d{8}$');
                return _mobile_pt.test(tar);
            case 'url' :
                var _url_pt = new RegExp('^http[s]?://[\\w\\.\\-]+$');
                return _url_pt.test(tar);
            case 'idcard':
                var _id_pt = new RegExp('((11|12|13|14|15|21|22|23|31|32|33|34|35|36|37|41|42|43|44|45|46|50|51|52|53|54|61|62|63|64|65|71|81|82|91)\\d{4})((((19|20)(([02468][048])|([13579][26]))0229))|((20[0-9][0-9])|(19[0-9][0-9]))((((0[1-9])|(1[0-2]))((0[1-9])|(1\\d)|(2[0-8])))|((((0[1,3-9])|(1[0-2]))(29|30))|(((0[13578])|(1[02]))31))))((\\d{3}(x|X))|(\\d{4}))');        
                return _id_pt.test(tar);
            case 'ip':
                var _ip_pt = new RegExp('^((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5]|[*])\\.){3}(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5]|[*])$');
                return _ip_pt.test(tar);
            case 'chinese':
                var _ch_pt = new RegExp('^([\u4E00-\uFA29]|[\uE7C7-\uE7F3])*$');
                return _ch_pt.test(tar);

            // default ==========================================================
            default: 
                this.throwError('TypeError', 'No Type Matched: ' + type );

        }

        return false;
    },///validate

    cloneObj: function(obj){
        var objClone ;
        if (obj.constructor == Object){
            objClone = new obj.constructor();
        }else{
            objClone = new obj.constructor(obj.valueOf());
        }

        for(var key in obj){

            if ( objClone[key] != obj[key] ){
                if ( typeof obj[key] == 'object' ){
                    objClone[key] = this.cloneObj(obj[key]);//深度克隆
                }else{
                    objClone[key] = obj[key];
                }
            }
        }

        objClone.toString = obj.toString;
        objClone.valueOf = obj.valueOf;

        return objClone;

    },

    updateObj: function(base, newFea){//a is base obj, newFea's attr will rewrite a's accoding attr
        /*for(var key in base){
            if(base.hasOwnProperty(key)){
                if(newFea.hasOwnProperty(key)){
                    base[key] = newFea[key];
                }
            }
        }*/
        for(var key in newFea){
            if(newFea.hasOwnProperty(key)){
                    base[key] = newFea[key];
            }
        }               
        return base;
    },

    delAttr: function(_obj, delAttr){
        stone.typeCheck(_obj, 'object');

        if(typeof delAttr =='string'){
            delete _obj[delAttr];
        }else if(stone.classOf(delAttr) == 'Array'){
            var len = delAttr.length;
            for(var i=0 ; i<len; i++){
                delete _obj[delAttr[i]];
            }
        }else {
            throw TypeError('Stone.delAttr() Expected String or Array, But got '+stone.classOf(delAttr));
        }   

        return _obj;
    },

    hasAttr: function(obj, attr){
        //not finished
        var attr = [].concat(attr);
        var len = attr.length;
        var notHas = [];
        for(var i=0; i<len; i++){
            if(!obj.hasOwnProperty(attr[i])){
                return false;
            }
        }   

        return true;            
    },

    getNotHasAttr: function(obj, attr){

        var attr = [].concat(attr);
        var len = attr.length;
        var notHas = [];
        for(var i=0; i<len; i++){
            if(obj.hasOwnProperty(attr[i])){

            }else {
                notHas.push(attr[i]);
            }
        }

        return notHas;
    },

    getFullName : function(ori,ext,type){
        if(ori == '') {
            this.throwError('Error','The original FileName can\'t be empty!');
        }

        this.typeCheck([[ori,'string'],[ext,'string']]);
        var rs = ori;

        var pt = new RegExp('$'+ext,'g');

        
        (!type) && (ori.indexOf(ext) == -1) && (!pt.test(ori)) && (rs+=('.'+ext)) ;//------------------------------------------------not all finished

        return rs;
        
    },

    getShortName: function(ori, ext, type){
        //this.typeCheck([[ori,'string'],[ext,'string']]);
        var pt = new RegExp('\.'+ext+'$','g');
        var rs = ori.replace(pt,'');//----del the extension

        return rs;
    },

    delay: function(fn, time){
        var task = setTimeout(fn, time);
        return task;
    },
    repeatTimer: function(callback,time){
        var _hash = this.hash = stone.noop;
        setTimeout(function(){
            if(typeof callback == 'function') { callback();}
            _hash = arguments.callee;
            setTimeout(arguments.callee,time);  
        },time);
    },
    removeTimer: function(){
        this.removeTimer.hash = null;
    },

    addURLParam : function(url,name,value){//put the parameters into url

        url += (url.indexOf('?') == -1 ? '?' : '&');
        url += encodeURIComponent(name) + '=' + encodeURIComponent(value);

        return url;
    },

    addParam: function(url,name,value){
        url += (url.indexOf('?') == -1 ? '?' : '&');
        url += name + '=' + value;
        return url;             
    },

    getUpper: function(str, pos){
        var pos = pos || 0;
        console.log(str[pos]);
        var rsStr = str[pos].toUpperCase()+str.slice(pos+1);

        return rsStr;
    },

    inString: function(tar, str){
        return !!(str.indexOf(tar) + 1);
    },

    ins: function(tar, source){
        var stype = this.getType(source);
        if(stype == 'array'){ return this.inArray(tar, source);}
        else if( stype == 'string'){ return this.inString(tar, source);}
        else {
            throw Error('TypeError: Expected arguments[1] string or array.');
        }
    },

    inArray: function(t,a,isRemove){
        if(this.classOf(a) == 'Array'){
            if(!a.length) { return false; }
            var len = a.length;
            for(var i=0; i<len; i++){
                if(t === a[i]){
                    return true;
                }
            }

            return false;
        }else {
            this.throwError('TypeError', 'Argumegs[1] Expected Array in Stone.inArray()');
        }
    },

    fnRun: function(fnCtn){
        var argType = this.getType(fnCtn);
        if(argType == 'array'){
            var len = fnCtn.length;
            for(var i=0; i<len; i++){
                fnCtn[i]();
            }
        }else if(argType == 'object'){
            for(var key in fnCtn) {
                if(fnCtn.hasOwnProperty(key)){
                    fnCtn[key]();// key();
                }
            }
        }else {
            throw new TypeError('fnRun Expected Param Array Or Object,But got ' + argType);
        }
    },
    trimHtmlTag: function(str){
        return str.replace(/<[^>].*?>/g,"");
    },
    getAutoIncrement: function(forId, baseNum){
        
        if(typeof _autoIncrement[forId] == 'number'){
            return ++_autoIncrement[forId];
        }else if(_autoIncrement[forId] == undefined){
            _autoIncrement[forId] = baseNum || 0;
            return _autoIncrement[forId];
        }else {
            stone.throwError('UncaughtError', 'Sorry,I don\' know. ');
        }

    },
    readAutoIncrement: function(forId){
        //stone.typeCheck(forId, 'string');
        return _autoIncrement[forId];
    },
    getGUID: function(forWhat){//create the GUID
        var curGUID = 'xxxxxxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){
                                        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                                        return v.toString(16);  
                                    }).toUpperCase();

        if(typeof forWhat == 'string') {
            _guidBase[forWhat] = curGUID;
        }   
                             
        return curGUID;
    },
    readGUID: function(forWhat){
        if(typeof forWhat == 'string'){
            return _guidBase[forWhat];
        }else {
            return _guidBase;
        }
    },
    throwError: function (errType,errMes,config,e){
        var e = e || { message:'There is an UnDescribed customError.'}, config = config || 'throw',errType = errType || 'ErrorFound', errMes = errMes || e.message || 'There is an UnDescribed customError.';

        switch(config){
          case 'throw':
            throw new Error(errType+': ' +errMes);
            break;
          case 'alert':
            alert(errType+': ' +errMes);
            break;
          case 'define':
          
            break;
        }///switch
    },
    //nodejs tools======================
    moveFile: function(source, tar, callback){
        var readStream = fs.createReadStream(source)
        var writeStream = fs.createWriteStream(tar);
        util.pump(readStream, writeStream, function() {
            //fs.unlinkSync(files.upload.path);
            callback ? callback() : '';
        });
        return this;
    },
    bufferCache: function(cache, key, bCon){
        var rs;
        cache[key] === undefined ? cache[key] = bCon : rs = cache[key];
        return rs;
    },
    cacheRender: function(res, tmpl, data){
        //stone.cacheRender(res, 'index.html', {title: 'Test Page', layout: false});
        var zcache = global.mainServer['zcache'];
        var cacheRs = this.bufferCache(zcache, tmpl);
        cacheRs instanceof Buffer ? 
            res.render(cacheRs.toString(), data) : 
            res.render(tmpl, data);
        console.log(cacheRs instanceof Buffer);
    },
    log: console.log

};///var exports