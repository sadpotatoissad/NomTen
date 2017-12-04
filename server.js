//const bodyParser = require("body-parser");
//const methodOverride = require("method-override");
//const morgan = require('morgan');

//const cookieParser = require('cookie-parser');
//mongo stuff
var MongoClient = require('mongodb').MongoClient
var url = "mongodb://csc309f:csc309fall@ds117316.mlab.com:17316/csc309db"

//express stuff
const express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'); //to handle POST requests
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// to send html over network
// https://stackoverflow.com/questions/31504798/using-express-js-to-serve-html-file-along-with-scripts-css-and-images
app.use( express.static( __dirname ));
app.use(cookieParser());
app.get('/', function(req, res) {
  if (req.cookies.login_cookie === undefined){
    res.sendFile(path.join( __dirname, 'index.html'));
  }
  else{

  }
  //res.cookie('login_cookie', "user_1");//hard coded to test
//  res.end("wow");
  //console.log("added cookie");


  });


//
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
app.delete('/users/:userId/category/:categoryId/ingredient/:ingredientId', function (req, res) {
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

// retrieves the specific user's data
app.get('/users/:userId', function(req, res) {

	var user = req.params.userId;
	MongoClient.connect(url, function(err, db) {
		if(err) console.log(err);
		console.log("Sending data for user: " + user);

		var query = {user_id: user};

		db.collection('AWebsiteHasNoName').find(query).toArray(function(err, result) {
			if (err) throw err;
			console.log(result);

			res.send(result);
			db.close();
		});

	});
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

app.post('/user_login', function(req, res){
	var user = req.body.user;
  var cookie = req.cookies.login_cookie;
  if (cookie === undefined)
  {
    // no: set a new cookie
    res.cookie('login_cookie', user);
    console.log('cookie created successfully');
  }
  else
  {
    // yes, cookie was already present
    console.log('user already stored', cookie);

  next(); // <-- important!
}

	MongoClient.connect(url, function(err, db){
			if(err) console.log(err)
			console.log("Checking if user exists");

			db.collection('AWebsiteHasNoName').update(
				{user_id: req.cookies.login_cookie},
				{$setOnInsert: {user_id: req.cookies.login_cookie, proteinList : [], carbList : [], dairyList : [], vegList : [], fruitList : [], miscList : []}},
				{upsert : true});

				res.sendStatus(200);
			db.close();
		});

});


app.put('/renameItem/users/:userId/category/:categoryId/oldIngredient/:oldIngredientId/newIngredient/:newIngredientId', function(req, res) {
	var user = req.params.userId;
	var category = req.params.categoryId;
	var oldIngredient = req.params.oldIngredientId;
	var newIngredient = req.params.newIngredientId;
	var match = {user_id: user};
	match[category] = oldIngredient;


	MongoClient.connect(url, function(err, db){
			if(err) console.log(err)
			console.log("Updating ingredient");

			var pull = {};
			pull[category] = {};
			pull[category]['$in'] = [oldIngredient];
			//should make pull = {category: { $in: [req.params.ingredientId]}}
			db.collection('AWebsiteHasNoName').update(
				{user_id: user},
				{$pull: pull}
				);

		  	var addToSet = {};
			addToSet[category] = newIngredient;
			console.log(addToSet);
		  	//should make addToSet = {category: [ingredient]}
			db.collection('AWebsiteHasNoName').update(
				{user_id: user},
				{$addToSet: addToSet}
				);

			res.sendStatus(200);
			db.close();
		});


});

app.listen(3000, function(){
	console.log("Server listening on PORT 3000")
});
