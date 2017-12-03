//mongo stuff
var MongoClient = require('mongodb').MongoClient
var url = "mongodb://csc309f:csc309fall@ds117316.mlab.com:17316/csc309db"

//express stuff
const express = require('express');
var bodyParser = require('body-parser'); //to handle POST requests
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// to get over chrome's security
// https://stackoverflow.com/questions/18642828/origin-http-localhost3000-is-not-allowed-by-access-control-allow-origin
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "http://localhost:3000");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(allowCrossDomain);

//remove ingredient from the db for given user
app.get('/users/:userId/category/:categoryId/ingredient/:ingredientId', function (req, res) {
    // Access userId via: req.params.userId
    // Access categoryId via: req.params.categoryId
    // Access ingredientId via: req.params.ingredientId
    //res.send(req.params);
    var category = req.params.categoryId;
	MongoClient.connect(url, function(err,res){
			if(err) console.log(err)
			console.log("Removing ingredient");
			db = res
			
			var pull = {};
			pull[category] = {};
			pull[category]['$in'] = [req.params.ingredientId];
			//should make pull = {category: { $in: [req.params.ingredientId]}}
			db.collection('AWebsiteHasNoName').update(
				{user_id: req.params.userId}, 
				{$pull: pull}
				);
			db.close();
		});
	res.send("deleted");

});

//curl -H "Content-Type: application/json" -X POST -d '{"user":"user_1", "category":"proteinList", "ingredient":"chicken"}' localhost:3000/add_ingredient
app.post('/add_ingredient',function(req,res){

  	var user = req.body.user;
  	var category = req.body.category;
  	var ingredient = req.body.ingredient;
  	console.log(user);
  	console.log(category);
  	console.log(ingredient);


  	//should make addToSet = {category: [ingredient]}
  	var addToSet = {};
	addToSet[category] = ingredient;
	console.log(addToSet);

	MongoClient.connect(url, function(err,res){
			if(err) console.log(err)
			console.log("Adding ingredient");
			db = res
			
			db.collection('AWebsiteHasNoName').update(
				{user_id: user}, 
				{$addToSet: addToSet}
				);
			db.close();
		});
  res.send("added");
});

app.post('/remove_ingredient',function(req,res){

  	var user = req.body.user;
  	var category = req.body.category;
  	var ingredient = req.body.ingredient;
  	console.log(user);
  	console.log(category);
  	console.log(ingredient);

  	//should make pull = {category: { $in: [ingredient]}}
  	var pull = {};
	pull[category] = {};
	pull[category]['$in'] = [ingredient];

	MongoClient.connect(url, function(err,res){
			if(err) console.log(err)
			console.log("Removing ingredient");
			db = res
			
			db.collection('AWebsiteHasNoName').update(
				{user_id: user}, 
				{$pull: pull}
				);
			db.close();
		});
  res.send("deleted");
});

app.post('/user_login', function(req, res) {
	var user = req.body.user;

	MongoClient.connect(url, function(err,res){
			if(err) console.log(err)
			console.log("Checking if user exists");
			db = res
			var exists = true;
			
			/*db.collection('AWebsiteHasNoName').find({user_id: user}).toArray(function(err,res) {
				if (res.length == []) { //if user doesn't exist then make one
					console.log("making new user");
					exists = false;
				} else {
					console.log("user already exists");
				}
			});*/
			console.log(exists);
			if (db.collection('AWebsiteHasNoName').find({user_id: user}).toArray() == []) {
				console.log("making new user");
				db.collection('AWebsiteHasNoName').insertOne({user_id: user, proteinList : [], carbList : [], dairyList : [], vegList : [], fruitList : [], miscList : []});
			} else {
				console.log("user already exists");
			}
			db.close();
		});

});

app.listen(3000, function(){
	console.log("Server listening on PORT 3000")
});