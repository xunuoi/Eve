var id_base = {},
    ccTid,
    G;

exports.init = function(G_){
    G = G_;
}    
exports.preClearContextCache = function(){
    function _setClear(){
        ccTid = setTimeout(function(){
            G.context.clear();
            ccTid = undefined;
        }, 7000);
    }
    //鱼忘七秒，人忘七年
    ccTid ? (clearTimeout(ccTid), _setClear()) : _setClear();
}