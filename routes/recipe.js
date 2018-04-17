var express    = require("express"),
    router     = express.Router(),
    middleware = require("../middleware"),
    request    = require("request"),
    User       = require("../models/users");
require('dotenv').config();

function urlAddKeys(url){
  var appid = "_app_id=" + process.env.YUMMLYAPIID;
  var apikey = "&_app_key=" + process.env.YUMMLYAPPKEY;
  url = url.replace("_app_id=", appid);
  url = url.replace("&_app_key=", apikey);
  return url;
}

//route to get recipes from Yummly API
router.get("/recipes/Query/:url", middleware.isLoggedIn, function(req, res){
  var url = req.params.url;
  url = urlAddKeys(url);
  url = url.replace("%26", "");
  request(url, function(error, response, body){
    if(!error && response.statusCode == 200){
      var data = JSON.parse(body);
      res.send(data);
    }else{
      console.log(error);
      req.flash("error", "something went wrong:(");
    }
  });
});

router.get("/recipes/Retrieve/:url", middleware.isLoggedIn, function(req, res){
  var url = req.params.url;
  url = urlAddKeys(url);
  url = url.replace("%26", "");
  request(url, function(error, response, body){
    if(!error && response.statusCode == 200){
      var data = JSON.parse(body);
      res.send(data);
    }else{
      req.flash("error", "something went wrong:(");
    }
  });
});

//route to retrive source
router.get("/recipes/source/:url", middleware.isLoggedIn, function(req, res){
  var url = req.params.url;
  url = urlAddKeys(url);
  url = url.replace("%26", "");
  request(url, function(error, response, body){
    if(!error && response.statusCode == 200){
      var data = JSON.parse(body);
      res.send(data);
    }else{
      req.flash("error", "something went wrong:(");
    }
  });
});

module.exports = router;
