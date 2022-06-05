var User = require("../models/user");
var passport = require("passport")
var getLogin = (req, res) => {
  //TODO: render login page
  var errors=req.flash().error || [];
  res.render('login',{errors});
};

var postLogin = (req, res) => {
  // TODO: authenticate using passport
  //On successful authentication, redirect to next page
  res.send('hey')
};

var logout = (req, res) => {
  // TODO: write code to logout user and redirect back to the page
  req.logout();
  res.redirect('/login');
};

var getRegister = (req, res) => {
  // TODO: render register page
  res.render('register')
};

var postRegister = (req, res) => {
  // TODO: Register user to User db using passport
  //On successful authentication, redirect to next page
  const {username, email, password} =req.body;
  User.findOne({username: username},(err,doc)=>{
    if(err){
      res.status(500).send("error occured");

    }
    else{
      if(doc){
        res.status(500).send("Username already exists");
      }
      else{
        var newUser = new User();
        newUser.username=username,
        newUser.email=email,
        newUser.password=newUser.hashPassword(password);
        newUser.save((err,user)=>{
          if(err){
            res.status(500).send("error occured");
          }
          else {
            res.render('login',{mssg:"User registered successfully"})
          }
        })
      }

    }
  });
};  




module.exports = {
  getLogin,
  postLogin,
  logout,
  getRegister,
  postRegister,
};
