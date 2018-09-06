var express    = require("express"),
    router     = express.Router(),
    passport   = require("passport"),
    User       = require("../models/users"),
    async_pkg  = require("async"),
    nodemailer = require("nodemailer"),
    middleware   = require("../middleware"),
    crypto     = require("crypto"),
    mg         = require("nodemailer-mailgun-transport"),
    mongoose   = require("mongoose");
require('dotenv').config();

//root route
router.get("/", function(req, res){
  res.render("index");
});

router.get("/users/:username", middlewareObj.isLoggedIn, function(req, res){
  res.render("profile");
});

//===============================
//         AUTH ROUTES
//===============================

//show sign up form
router.get("/register", function(req, res){
  res.render("register");
});

//handle sign up
router.post("/register", function(req, res){

  if (!validateEmail(req.body.email)) {
    req.flash("error", "email is invalid");
    return res.redirect("/register");
  } else {

    var newUser = new User({
      username: req.body.username,
      email: req.body.email,
      local: true
    });

    User.findOne({email: req.body.email}, function(err, user) {
      if(err){
        req.flash("error", err.message);
        return res.redirect("/register");
      }
      if (user != null){
        console.log("email already exists");
        req.flash("error", "A user with the given email is already registered");
        return res.redirect("/register");
      }

      // Registers user in the database
      User.register(newUser, req.body.password, function(err, user){
         if(err){
           req.flash("error", err.message);
           return res.redirect("/register");
         } else {
          // Send a confirmation email
          async_pkg.waterfall([

            // Generate token
            function(done) {
              crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString("hex");
                done(err, token);
              });
            },
            function(token, done) {
              // Find User
              var expTime = Date.now() + (3600000 * 48);
              User.findOneAndUpdate({ email: req.body.email },{$set:{
                emailConfirmed: false, confirmToken: token, confirmExpires: expTime}} 
                ,function(err, user) {
                if((!user) || err){
                  console.log("error finding user with given email" + err);
                  req.flash("error", "Something went wrong :(");
                }
                done(err, token, user);
              });
            },
            function(token,user, done) {
              // Send confirmation email
              var auth = {
                auth: {
                  api_key: process.env.MAILGUNKEY,
                  domain: process.env.MAILGUNDOMAIN
                }
              };
              var nodemailerMailgun = nodemailer.createTransport(mg(auth));

              nodemailerMailgun.sendMail({
                to: user.email,
                from: process.env.TESTGMAIL,
                subject: 'Node.js Registration Confirmation',
                text: 'You are receiving this because you (or someone else) have registered for a NomTen account.\n\n' +
                  'Please click on the following link, or paste this into your browser to complete the registration process:\n\n' +
                  'http://' + req.headers.host + '/confirmation/' + token + '\n\n' +
                  'If you did not request this, please ignore this email.\n'
              },function(err, info){
                if(err){
                  console.log(err);
                  req.flash("error", "error in sending registration email");
                  User.remove({email: req.body.email}).exec();
                  return res.redirect("back");
                }
                req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
                res.redirect('/');
              });
            }

            ], function(err) {
            if (err) {
              req.flash("error", "error in sending registration email");
              User.remove({email: req.body.email}).exec();
              return res.redirect("back");
            }
          });
         }
      });
  });
  }
});

// Resend confirmation email page
router.get("/confirmation/resend",function(req, res) {
  res.render("resend");
});

// Resend confirmation email
router.post("/confirmation/resend", function(req, res, next) {
  User.findOne({ email: req.body.email, confirmExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user){
      req.flash('error', 'Email not found, please register for an account.');
      return res.redirect('/');
    } else if (user.emailConfirmed){
      req.flash('error', 'Email has already been confirmed.');
      return res.redirect('/');
    } else if (err){
      console.log(err);
      req.flash("error", "something went wrong :(");
      return res.redirect("/");
    }
    User.findOneAndUpdate({ confirmToken: user.confirmToken },{$set:{
      confirmExpires: Date.now() + (3600000 * 48)}}); 
    // Send confirmation email
    var auth = {
      auth: {
        api_key: process.env.MAILGUNKEY,
        domain: process.env.MAILGUNDOMAIN
      }
    };
    var nodemailerMailgun = nodemailer.createTransport(mg(auth));

    nodemailerMailgun.sendMail({
      to: req.body.email,
      from: process.env.TESTGMAIL,
      subject: 'Node.js Registration Confirmation',
      text: 'You are receiving this because you (or someone else) have registered for a NomTen account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the registration process:\n\n' +
        'http://' + req.headers.host + '/confirmation/' + user.confirmToken + '\n\n' +
        'If you did not request this, please ignore this email.\n'
    },function(err, info){
      if(err){
        console.log(err);
        req.flash("error", "error in resending confirmation email");
        return res.redirect("back");
      }
      req.flash('success', 'An e-mail has been sent to ' + req.body.email + ' with further instructions.');
      res.redirect('/');
    });
  });
});

// Confirm User
router.get('/confirmation/:token', function(req, res) {

  User.findOneAndUpdate({ confirmToken: req.params.token, confirmExpires: { $gt: Date.now() }}, {$set:{
      emailConfirmed: true}}, function(err, user) {
    if (!user) {
      req.flash('error', 'Confirmation link is invalid or expired.');
      return res.redirect('/');
    } else if (user.emailConfirmed){
      req.flash('error', 'Email has already been confirmed.');
      return res.redirect('/');
    } else if (err){
      console.log(err);
      req.flash("error", "something went wrong :(");
      return res.redirect("/");
    }

    console.log("verified user email");
    req.flash("success", "Email confirmed.")
    res.redirect('/');
  });
});

//handle user login
router.post("/login", function(req, res){
  passport.authenticate("local",
  {
    failureRedirect: "/",
    failureFlash: true
  }, function(err, user, info) {
    if (!user.emailConfirmed) {
      if (user.confirmExpires > Date.now()){
      	message = "Please verify your email before logging in. <a href='/confirmation/resend'> Click here to resend confirmation email. </a>";
        req.flash("error", message)
        return res.redirect("/")
      } else {
        // delete user if email hasn't been confirmed by the expire date
        User.remove({email: user.email}).exec();
        req.flash("error", "Password or username is incorrect");
        return res.redirect("/");
      }
    }
    req.logIn(user, function(err) {
      if (err) { 
        req.flash("error", err);
        return res.redirect("/"); 
      }
      return res.redirect('/users/' + user.username);
    });
  }) (req, res);;
});

//logout route
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "You have logged out");
  res.redirect("/");
});

//FORGOT PASSWORD
router.get("/forgot", function(req, res){
  res.render("forgot");
});

//SEND EMAIL WITH PASSWORD RESET TOKEN
router.post("/forgot", function(req, res, next) {
  if (!validateEmail(req.body.email)) {
    req.flash("error", "email is invalid");
    return res.redirect("/forgot");
  } else {
    async_pkg.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString("hex");
          done(err, token);
        });
      },
      function(token, done) {
        var expTime = Date.now() + 3600000;
        User.findOneAndUpdate({ email: req.body.email },{$set:{resetPasswordToken:token, resetPasswordExpires:expTime} } ,function(err, user) {
          if (!user) {
            req.flash("error", "Email address is not registered with an account.");
            return res.redirect("/forgot");
          }

          if (!user.emailConfirmed) {
          	req.flash("error", "Please confirm email address before requesting a password reset. <a href='/confirmation/resend'> Click here to resend confirmation email</a>.");
            return res.redirect("/forgot"); 
          }

          if(err){
            console.log("error finding user with given email" + err);
            req.flash("error", "Something went wrong :(");
            return res.redirect("/forgot");
          }
          done(err, token, user);
        });
      },
      function(token, user, done) {
        var auth = {
          auth: {
            api_key: process.env.MAILGUNKEY,
            domain: process.env.MAILGUNDOMAIN
          }
        };
        var nodemailerMailgun = nodemailer.createTransport(mg(auth));

        nodemailerMailgun.sendMail({
          to: user.email,
          from: process.env.TESTGMAIL,
          subject: 'Node.js Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        },function(err, info){
          if(err){
            console.log(err);
            req.flash("error", "error in sending registration email");
            return res.redirect("back");
          }
          req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
  }
});

//RESET PASSWORD FORM
router.get('/reset/:token', function(req, res) {

  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    else if (err){
      console.log(err);
      req.flash("error", "something went wrong :(");
      return res.redirect("/forgot");
    }
    res.render('reset', {token: req.params.token});
  });
});

//UPDATE PASSWORD
router.post("/reset/:token", function(req, res) {
  async_pkg.waterfall([
    function(done) {
      User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      }, function(err, user) {
        if (err) {
          console.log(err);
          req.flash("error", "Something went Wrong :(");
          return res.redirect("back");
        } else if (!user) {
          console.log(err);
          req.flash("error", "Password reset token is invalid or has expired");
          return res.redirect("back");
        }
        if (req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            if (err) {
              req.flash("error", "Something went Wrong :( password not updated");
              return res.redirect("back");
            }
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            user.local = true;

            user.save(function(err) {
              if (err) {
                req.flash("error", "Something went Wrong :( password not updated");
                return res.redirect("back");
              }
              req.logIn(user, function(err) {
                if (err) {
                  console.log(err);
                  req.flash("error", "Something went Wrong :/");
                  return res.redirect("back");
                }
                done(err, user);
              });
            });
          });
        } else {
          req.flash("error", "Passwords do not match.");
          return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var auth = {
        auth:{
          api_key : process.env.MAILGUNKEY,
          domain: process.env.MAILGUNDOMAIN
        }
      }
      var nodemailerMailgun = nodemailer.createTransport(mg(auth));
      nodemailerMailgun.sendMail({
        to: user.email,
        from: process.env.TESTGMAIL,
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
              'This is a confirmation that the password for your account '
              + user.email + ' has just been changed.\n'
      }, function(err, info){
        if(err){
          console.log("error at password update confirmation email" + err);
          req.flash("error", "Something went wrong :(");
          return res.redirect("back");
        }
        req.flash("success", "Success! your password has been changed.")
        done(err);
      });
    }
  ], function(err) {
    if (err) {
      console.log(err);
      return res.redirect("back");
    }
    res.redirect("/");
  });
});

router.get("/update_password", middlewareObj.isLoggedIn, function(req, res){
	res.render("update");
})
router.post("/update_password", middlewareObj.isLoggedIn, function(req, res){
    user = req.user;
    if (req.body.newPassword === req.body.confirm) {
      if (req.user.local) {
      user.changePassword(req.body.oldPassword, req.body.newPassword, function(err) {
        if (err) {
          if (err.name == 'IncorrectPasswordError') {
          	req.flash("error", "Password is incorrect.");
          } else {
          	req.flash("error", "Something went Wrong :( password not updated");
          }
          return res.redirect("/update_password");
        }
        user.save(function(err) {
          if (err) {
            req.flash("error", "Something went Wrong :( password not updated");
            return res.redirect("/update_password");
          };
          req.flash("success", "Password has successfully been changed.");
          return res.redirect("/users/home");
        });
      });
  	  } else {
  	  	user.setPassword(req.body.newPassword, function(err) {
  	  		if (err) {
			  	req.flash("error", "Something went Wrong :( password not updated");
			 	return res.redirect("/update_password");
  	  		}
  	  		user.local = true;
	        user.save(function(err) {
	          if (err) {
	            req.flash("error", "Something went Wrong :( password not updated");
	            return res.redirect("/update_password");
	          };
	          req.flash("success", "Password has successfully been changed.");
	          return res.redirect("/users/home");
	        });
  	  	})
  	  }
    } else {
      req.flash("error", "Passwords do not match.");
      return res.redirect('back');
    }
})

module.exports = router;

// Checks if the given email is in a valid format
function validateEmail(email) {
  // Regular Expression taken from https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
  var emailRegex = RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  return emailRegex.test(email);
}