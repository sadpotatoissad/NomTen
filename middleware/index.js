var User = require("../models/users");
//all middleware
middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "Please login first!");
  return res.redirect("/");
}

module.exports = middlewareObj;
