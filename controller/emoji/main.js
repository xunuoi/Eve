
var imgTag = '<img src=":@=src" />',
    basePath = '/static/eve/emoji/img/',
    emojiDict = {
        'cute': 'cute.gif',
        'happy': 'happy.jpg',
        'crazy': 'crazy.gif',
        'shy': 'shy.jpg',
        'smile': 'smile.jpg',
        'lalala': 'lalala.gif',
        'wow': 'wow.jpg',
        'yeah': 'yeah.jpg',
        'bored': 'bored.gif',
        'dai': 'dai.gif',
        'dance': 'dance.gif'
    };
function emojiImg(em){
    var n = emojiDict[em];
    if(n){
        return basePath+n;  
    }else {
        return null;
    }
    
}
function render(mark, data){
    return imgTag.replace(':@='+mark, data);
}

var emutil = {
    get: function(em){
        var ems = emojiImg(em);
        if(ems)
            return render('src', ems);
        else {
            console.warn('No emotion: '+em);
            return ' '
        }
    }
}


module.exports = emutil;