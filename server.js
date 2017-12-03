//mongo stuff
var MongoClient = require('mongodb').MongoClient
var url = "mongodb://csc309f:csc309fall@ds117316.mlab.com:17316/csc309db"

//express stuff
const express = require('express');
var bodyParser = require('body-parser'); //to handle POST requests
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

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

app.listen(3000, function(){
	console.log("Server listening on PORT 3000")
});