var express        = require("express"),
    app            = express(),
    cookieParser   = require("cookie-parser"),
		mongoose       = require("mongoose"),
		passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
		bodyParser     = require("body-parser"),
		request        = require("request"),
		methodOverride = require("method-override"),
		flash          = require("connect-flash"),
		async_pkg      = require("async"),
    nodemailer     = require("nodemailer"),
    mg             = require("nodemailer-mailgun-transport"),
    crypto         = require("crypto"),
    User           = require("./models/users"),
    schedule      = require("node-schedule"),
    facebookPassport = require('passport-facebook'), 
    facebookStrategy = require('passport-facebook').Strategy,
    googleStrategy = require('passport-google-oauth').OAuth2Strategy;
require('dotenv').config();

//require routes
var indexRoutes      = require("./routes/index"),
    ingredientRoutes = require("./routes/ingredients"),
    recipeRoutes     = require("./routes/recipe");

/*
app.use((req, res, next) => {
  	if (req.header("x-forwarded-proto") !== "https") {
    	res.redirect(`https://${req.header('host')}${req.url}`);
  	}else {
    	next();
  	}
});
*/

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var url = process.env.DATABASEURL || "mongodb://localhost/Nomlly";
mongoose.connect(url, {useMongoClient: true});

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
  secret: process.env.SESSIONSECRETKEY,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.info = req.flash("info");
  next();
});

app.use("/", indexRoutes);
app.use("/", ingredientRoutes);
app.use("/", recipeRoutes);

// FACEBOOK LOGIN
passport.use(new facebookStrategy({
    clientID: process.env.FB_APP_ID,
    clientSecret: process.env.FB_APP_SECRET,
    callbackURL: process.env.FB_CALLBACK_URL,
    profileFields: ['name', 'emails'],
    passReqToCallback : true

}, function(req, accessToken, refreshToken, profile, cb) {

  // If user is not logged in
  if (!req.user) {
    User.findOne({'facebook.id' : profile.id}, function(error, user) {
      if (error) {
        cb(error);
      }

      // User already has acc on db
      if (user) {
        return cb(null, user);
      } else {
        User.findOne({'email': profile.emails[0].value}, function(error, user) {
        
        if (error) {
          cb(error);
        }

        // email already in use
        if (user){
          req.flash('error', 'Email associated with Facebook account already in use. Please log in first and then connect Facebook account.');
          cb(null);
        } else {

        var newUser = new User({
        username: profile.name.givenName,
        email: profile.emails[0].value,
        emailConfirmed: true,
        facebook: {
          id: profile.id,
          token: accessToken
        }});
        newUser.save(function(error) {
          if (error) {
            console.log(error);
          }
          return cb(null, newUser);
          })
        }
        });
      }
    });
  } else { 
  // User is logged in so link fb account
    var user = req.user;
    user.facebook.id = profile.id;
    user.facebook.token = accessToken;
    user.save(function(error) {
      if (error) {
        console.log(error);
      }
      return cb(null, user);
    })
  }
}));

app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/users/fb',
        failureRedirect: '/'
    }));

app.get('/link/facebook', passport.authorize('facebook', {scope: 'email'}));

app.get('/link/facebook/callback',
    passport.authorize('facebook', {
        successRedirect: '/users/fb',
        failureRedirect: '/'
    }));

app.get('/unlink/facebook', function(req, res) {
  var user = req.user;
  // Check that facebook account exists, and if there is another method 
  // to login once removing facebook account
  if (((user.local || user.toObject().google) && user.toObject().facebook)) {
    user.facebook = undefined;
    user.save(function(error){
      res.redirect('back');
    });
  } else {
    req.flash('error', "Cannot unlink Facebook account.")
    res.redirect('back');
  }
});

// GOOGLE LOGIN
passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    scope: ['email'],
    passReqToCallback : true
  }, function(req, accessToken, refreshToken, profile, cb) {

  if(!req.user) {
    User.findOne({'google.id' : profile.id}, function(error, user) {
      if (error) {
        cb(error);
      }

      // User already has acc on db
      if (user) {
        return cb(null, user);
      } else {
        User.findOne({'email': profile.emails[0].value}, function(error, user) {
        
        if (error) {
          cb(error);
        }

        // email already in use
        if (user){
          req.flash('error', 'Email associated with Google account already in use. Please log in first and then connect Google account.');
          cb(null);
        } else {

        var newUser = new User({
        username: profile.displayName,
        email: profile.emails[0].value,
        emailConfirmed: true,
        google: {
          id: profile.id,
          token: accessToken
        }});
        newUser.save(function(error) {
          if (error) {
            console.log(error);
          }
          return cb(null, newUser);
          })
        }
        });
      }
    });
  } else { 
  // User is logged in so link fb account
    var user = req.user;
    user.google.id = profile.id;
    user.google.token = accessToken;
    user.save(function(error) {
      if (error) {
        console.log(error);
      }
      return cb(null, user);
    })
  }
  })
);

app.get('/auth/google', passport.authenticate('google', {scope:'email'}));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/users/google',
        failureRedirect: '/'
    }));

app.get('/link/google', passport.authorize('google', {scope: 'email'}));

app.get('/link/google/callback',
    passport.authorize('google', {
        successRedirect: '/users/google',
        failureRedirect: '/'
    }));

app.get('/unlink/google', function(req, res) {
  var user = req.user;
  // Check that google account exists, and if there is another method 
  // to login once removing google account
  if ((user.local || user.toObject().facebook) && user.toObject().google) {
    user.google = undefined;
    user.save(function(error){
      res.redirect('back');
    });
  } else {
    req.flash('error', "Cannot unlink Google account.")
    res.redirect('back');
  }
});

// Clean database every Monday at 3 am
var rule = new schedule.RecurrenceRule();
rule.minute = 0;
rule.hour = 3;
rule.dayOfWeek = 1;

var cleanDb = schedule.scheduleJob(rule, function(){
  User.remove({emailConfirmed: false, confirmExpires: {$lt: Date.now()}}).exec();
});

app.listen(process.env.PORT||3000);