const express = require("express");
const app = express();
var mongoose = require("mongoose");
var passport = require("passport");
var auth = require("./controllers/auth");
var store = require("./controllers/store");
var User = require("./models/user");
var localStrategy = require("passport-local");
var MongoURI = require('./Config/db').MongoURI;
/* TODO: CONNECT MONGOOSE WITH OUR MONGO DB  */
mongoose.connect(MongoURI,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
  .then(()=> {
    console.log("Connected to Database");
  })
  .catch(err=>console.log(err));
//importing the middleware object to use its functions
var middleware = require("./middleware"); //no need of writing index.js as directory always calls index.js by default

var port = process.env.PORT || 8000;

app.use(express.static("public"));

/*  CONFIGURE WITH PASSPORT */
app.use(
  require("express-session")({
    secret: "decryptionkey", //This is the secret used to sign the session ID cookie.
    resave: false,
    saveUninitialized: true,
  })
);

require('./passport')(passport);
app.use(passport.initialize()); //middleware that initialises Passport.
app.use(passport.session());
// passport.use(new localStrategy(User.authenticate())); //used to authenticate User model with passport
// passport.serializeUser(User.serializeUser()); //used to serialize the user for the session
// passport.deserializeUser(User.deserializeUser()); // used to deserialize the user

app.use(express.urlencoded({ extended: false })); //parses incoming url encoded data from forms to json objects

// EJS

app.set("view engine", "ejs");

//THIS MIDDLEWARE ALLOWS US TO ACCESS THE LOGGED IN USER AS currentUser in all views
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});



app.get("/",middleware.isLoggedIn, (req, res) => {
  res.render('index', {title:"Library"});
});

/*-----------------Store ROUTES
TODO: Your task is to complete below controllers in controllers/store.js
If you need to add any new route add it here and define its controller
controllers folder.
*/

app.get("/books", store.getAllBooks);

app.get("/book/:id", store.getBook);

app.get("/books/loaned",
//TODO: call a function from middleware object to check if logged in (use the middleware object imported)
 store.getLoanedBooks);

app.post("/books/issue", 
//TODO: call a function from middleware object to check if logged in (use the middleware object imported)
store.issueBook);

app.post("/books/search-book", store.searchBooks);

/* TODO: WRITE VIEW TO RETURN AN ISSUED BOOK YOURSELF */

/*-----------------AUTH ROUTES
TODO: Your task is to complete below controllers in controllers/auth.js
If you need to add any new route add it here and define its controller
controllers folder.
*/

app.get("/login",middleware.stillLoggedIn, auth.getLogin);

app.post("/login",passport.authenticate('local',{
  failureRedirect:'/login',
  successRedirect:'/',  
}), auth.postLogin);

app.get("/register",middleware.stillLoggedIn, auth.getRegister);

app.post("/register", auth.postRegister);

app.get("/logout", auth.logout);

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
