define(function (require, exports, module) {
var eve;

function doEx(){
    //name
    eve.learn('what is your name::My name is Eve');
    eve.learn('tell me your name::My name is Eve');
}

exports.init = function(eveMod){
    eve = eveMod;
    doEx();
}
})