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
    schedule      = require("node-schedule")
require('dotenv').config();

//require routes
var indexRoutes      = require("./routes/index"),
    ingredientRoutes = require("./routes/ingredients"),
    recipeRoutes     = require("./routes/recipe");

app.use((req, res, next) => {
  	if (req.header("x-forwarded-proto") !== "https") {
    	res.redirect(`https://${req.header('host')}${req.url}`);
  	}else {
    	next();
  	}
});

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

// Clean database every Monday at 3 am
var rule = new schedule.RecurrenceRule();
rule.minute = 0;
rule.hour = 3;
rule.dayOfWeek = 1;

var cleanDb = schedule.scheduleJob(rule, function(){
  User.remove({emailConfirmed: false, confirmExpires: {$lt: Date.now()}}).exec();
});

app.listen(process.env.PORT||3000);