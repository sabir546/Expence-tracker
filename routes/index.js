var express = require('express');
var router = express.Router();
const passport=require('passport');
const User=require('../models/database')
const Expense=require('../models/expenses')
const localStrategy=require('passport-local');
const { escapeXML } = require('ejs');
passport.use(new localStrategy(User.authenticate()));
const nodemailer=require('nodemailer')

const { sendmail } = require("../utils.js/sendmail");
const expenses = require('../models/expenses');

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

router.get("/profile", isLoggedIn, async function (req, res, next) {
  try {
      const user = await req.user.populate("expenses");
      // console.log(req.user, expenses);
     
      res.render("profile", { admin: req.user,  expenses:user.expenses });
  } catch (error) {
      res.send(error);
  }
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
      // res.redirect('/match-otp')
  } catch (error) {
      console.log(error);
      res.send(error);
  }
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

router.get('/createexpense', isLoggedIn, function(req, res, next) {
  res.render('profile',{ admin: req.user });
});


router.post('/createexpense', isLoggedIn,async function(req, res, next) {
  try {
    const expense=new Expense(req.body)
    req.user.expenses.push(expense._id)
    expense.user=req.user._id;
    await expense.save();
    await req.user.save(); 
    res.redirect('/profile')

    
  } catch (error) {
    res.send(error)
  }
});

router.get("/filter", async function (req, res, next) {
  try {
      let { expenses } = await req.user.populate("expenses");
      expenses = expenses.filter((e) => e[req.query.key] == req.query.value);
      res.render("profile", { admin: req.user, expenses });
  } catch (error) {
      console.log(error);
      res.send(error);
  }
});


router.get("/delete/:id", isLoggedIn, async function (req, res, next) {
  try {
      const PostIndex = req.user.expenses.findIndex(
          (u) => u._id === req.params.id
      );
      req.user.expenses.splice(PostIndex, 1);
      await req.user.save();

      await Expense.findByIdAndDelete(req.params.id);
      res.redirect("/profile");
  } catch (error) {
      res.send(error);
  }
});



module.exports = router;
