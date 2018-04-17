var express    = require("express"),
    router     = express.Router(),
    middleware = require("../middleware"),
    User       = require("../models/users");
require('dotenv').config();

// retrieves the specific user's data
router.get('/users/:userId', middlewareObj.isLoggedIn, function(req, res) {
  User.findById(req.params.id, function(err, user){
    if (err || !user){
      req.flash("error", "Something went wrong");
      return res.redirect("back");
    }
    res.send(user);
  });
});


router.post('/users/:userId/addIngredient', middlewareObj.isLoggedIn, function(req,res){
  	var user = req.params.userId;
  	var category = req.body.data.category.toString();
  	var ingredient = req.body.data.newfoodItem.toString().trim();
    //ignore empty inputs and inputs with just spaces
    if(ingredient === ""){
      return res.redirect("back");
    }
    User.findByIdAndUpdate(
      {_id: user}, {$push:{[category]: ingredient}}, {safe: true, upsert: true}, function(err, updatedUser){
        if (err || !updatedUser){
          console.log(err);
          req.flash("error", "failed to add ingredient");
          return res.redirect("back");
        }
        res.send("success");
      }
    );

});

router.delete('/users/:userId/removeIngredient', middlewareObj.isLoggedIn, function(req,res){
  	var user = req.params.userId;
  	var category = req.body.data.category;
  	var ingredient = req.body.data.ingredient;
    User.findByIdAndUpdate({_id: user}, { $pull: {[category]: ingredient}}, function(err, user){
      if(err || !user){
        req.flash("error", "Something went wrong when deleting indegredient");
        return res.redirect("back");
      }
      res.send(user[category]);
    });
});

//no frontend implementation for this currently
/*ingredient edit route
@author David Wahrhaftig*/
router.put('users/:userId/category/:categoryId/oldIngredient/:oldIngredientId/newIngredient/:newIngredientId', middlewareObj.isLoggedIn, function(req, res) {
	var user = req.params.userId;
	var category = req.params.categoryId;
	var oldIngredient = req.params.oldIngredientId;
	var newIngredient = req.params.newIngredientId;
  User.findByIdAndUpdate({_id: user},{ $pull: {category: oldIngredient }, $push: {category: newIngredient}}, function(err, user){
    if(err || !user){
      req.flash("error", "Something went wrong when deleting indegredient");
      return res.redirect("back");
    }
    res.send(user[category]);
  });
});

module.exports = router;
