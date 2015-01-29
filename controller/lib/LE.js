
var attr = {
    'happy': {},
    'ability': {},
    'health': {},
    'busy': {}
}

var conf = {
    'name': 'Eve',
    'age': 0.1,
    LE: {
        'happy': 0.1,
        'ability': 0.01,
        'hurt': 0,
        'health': 0.6,
        'busy': 0.1
    },
    getStatus: function(){
        return (this.LE['happy'] + this.LE['ability']+ this.LE['ability'] + this.LE['health'] - this.LE['hurt'] - this.LE['busy'])/5;
    },
    effectLE: function(le,delta){
        return this.LE[le] += delta;
    },
    habbit: {
        'love': ['draco']
    }
}

exports.conf = conf;

exports.getStatus = function(){
    return conf.getStatus();
};
exports.effectLE = function(a, b){
    return conf.effectLE(a, b);
}
