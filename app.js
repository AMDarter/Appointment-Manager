// Appointment Manager
var express = require("express"),
  mongoose = require("mongoose"),
  keys = require("./config/keys"),
  passport = require("passport"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  User = require("./models/user"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// MongoDB Mongoose Mlab
mongoose.connect(
  keys.mongoURI,
  { useNewUrlParser: true }
);
// Passport
app.use(
  require("express-session")({
    secret: "I Love Pizza",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// ****** Auth Routes *****************************

//Register
app.get("/register", function(req, res) {
  res.render("register");
});
//User Sign up
app.post("/register", function(req, res) {
  User.register(
    new User({
      username: req.body.username,
      userFirstName: req.body.userFirstName,
      userLastName: req.body.userLastName,
      organization: req.body.organization
    }),
    req.body.password,
    function(err, user) {
      if (err) {
        console.log(err);
        return res.render("register");
      }
      passport.authenticate("local")(req, res, function() {
        res.redirect("/");
      });
    }
  );
});

// Login
app.get("/login", function(req, res) {
  res.render("login");
});
//login logic
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);
// Logout
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});
// Require Routes
app.use(require("./routes"));

// **************************************************
app.listen(3030, "localhost", () => {
  console.log("Appointment Manager App has Started on port 3030");
});
