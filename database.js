var mongoose = require('mongoose');
var url = "mongodb://csc309f:csc309fall@ds117316.mlab.com:17316/csc309db";
mongoose.connect(url);
var AWebsiteHasNoNameUser = mongoose.Schema({
   user_id: String,
   proteinList: [String],
   carbList: [String],
   dairyList: [String],
   vegList: [String],
   fruitList: [String],
   miscList:[String],
});
var User = mongoose.model("User", AWebsiteHasNoNameUser);
/*
MongoClient.connect(url, function(err,res){
				if(err) console.log(err)
				console.log("Database created");
				db = res
        var usr2= {user_id: "usr2", vegetables: ['Squash', 'Cranberries']}

db.collection("AWebsiteHasNoName").insertOne(usr2, function(err, res){

	});
  var data = {user: "usr3", protein: ['Chicken']}
db.collection("AWebsiteHasNoName").insertOne(usr3, function(err, res){

	});
			//see if the above worked
       db.collection("AWebsiteHasNoName").find({user_id:"usr2"}).project({ _id:0});

    });

*/

/*

    MongoClient.connect(url, function(err,res){
    if(err) console.log(err)
        console.log("Database created");
        res = db
    var user_db_id = db.collection("AWebsiteHasNoName").find({user_id: cur_user_id})._id;
    db.collection("AWebsiteHasNoName").update(
      {user_id: cur_user_id},
      {
        $addToSet: {currentSelectedList:item_name}
      },
      { upsert: true }
    );
    //makes sure its added
    console.log(db.collection("AWebsiteHasNoName").find({}));
    db.close();
  })
  */
