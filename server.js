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
    User           = require("./models/users");
require('dotenv').config();
mongoose.Promise = global.Promise;

//require routes
var indexRoutes      = require("./routes/index"),
    ingredientRoutes = require("./routes/ingredients"),
    recipeRoutes     = require("./routes/recipe");

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

app.listen(process.env.PORT||3000);
