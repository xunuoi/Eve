var redis = require("then-redis"),
	    db = redis.createClient();

db.on("error", function (err) {
	    console.log("Error " + err);
});

/*client.set("string key", "xcvasd --- -asdfasd=asd=f asfstring val", redis.print);
//client.hset("hash key", "hashtest 1", "some value", redis.print);
//client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
//client.hkeys("hash key", function (err, replies) {
//	    console.log(replies.length + " replies:");
//		    replies.forEach(function (reply, i) {
//				        console.log("    " + i + ": " + reply);
//						    });
//			    client.quit();
//});

client.get('string key', function(err, reply){
	console.log(reply);
})
*/




// Hashes
var originalHash = { a: 'one', b: 'two', 'hipig': '09asd0f', dog: [1,2,3,4], pig: {s: 1231}};
db.hmset('my-hash', originalHash);
db.hgetall('my-hash').then(function (hash) {
    console.log(hash.pig);
    db.quit();
});