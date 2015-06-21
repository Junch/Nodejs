var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/winedb');
db.collection('wines').find().toArray(function(err, result){
	if (err) throw err;
    console.log(result);
    db.close();
});
