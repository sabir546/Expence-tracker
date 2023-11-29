var express = require('express');
var router = express.Router();
const passport=require('passport');
const User=require('../models/database')
const expense=require('../models/expenses')
const localStrategy=require('passport-local');
const { escapeXML } = require('ejs');
passport.use(new localStrategy(User.authenticate()));

const { sendmail } = require("../utils.js/sendmail");

/* GET home page. */


router.get('/', function(req, res, next) {
  res.render('index',{ admin: req.user });
});
router.get('/signin', function(req, res, next) {
  res.render('index',{ admin: req.user });
});
router.get('/signup', function(req, res, next) {
  res.render('index',{ admin: req.user });
});

router.post('/signup', async function(req, res, next) {
try {
  await User.register({
    username:req.body.username,
    email:req.body.email,
  }
  ,
  req.body.password
  );
  res.redirect('/signin')
}
 catch (error) {
  console.log(error)
}
});

router.post('/signin',passport.authenticate('local',{
  successRedirect:'/profile',
  failureRedirect:'/signin',
}), function(req, res, next) {});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) {
    next();
  }
  else(
    res.redirect('/signin')
  )
  
}
router.get('/signout',isLoggedIn, function(req, res, next) {
 req.logOut(()=>{
  res.redirect('/singin')
 })
});

router.get('/profile', isLoggedIn ,function(req, res, next) {
  res.render('profile',{ admin: req.user });
});

router.get('/forget', function(req, res, next) {
  res.render('forget',{ admin: req.user });
});

// router.post('/forget',async function(req, res, next) {
//   try { const user= await User.findOne({username:req.body.username})
//     if(!user)
//     return res.send("User not found! <a href='/forget'>Try Again</a>.");

//   await user.setPassword(req.body.newPassword)
//   await user.save();
//   res.redirect('/signin')
//   }
//    catch (error) {
//     res.send(error)
//   }
// });





router.post("/send-mail", async function (req, res, next) {
  try {
      const user = await User.findOne({ email: req.body.email });
      if (!user)
          return res.send("User Not Found! <a href='/forget'>Try Again</a>");

      sendmail(user.email, user, res, req);
      res.redirect('/match-otp/:id')
  } catch (error) {
      console.log(error);
      res.send(error);
  }
});

router.get('/match-otp/:id', function(req, res, next) {
  res.render('matchotp',{ user:User, admin: req.params.id });
});

router.post('/match-otp/:id', async function (req, res, next) {
  try {
      const user = await User.findById(req.params.id);
      
      if (!user)
          return res.send("User not found! <a href='/forget'>Try Again</a>.");

      if (user.token == req.body.token) {
          user.token = -1;
          await user.setPassword(req.body.newpassword);
          await user.save();
          res.redirect("/signin");
      } else {
          user.token = -1;
          await user.save();
          res.send("Invalid Token! <a href='/forget'>Try Again<a/>");
      }
  } catch (error) {
      res.send(error);
  }
});





module.exports = router;
