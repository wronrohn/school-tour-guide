const express = require("express");
var path = require('path');
const bodyParser = require("body-parser");
const app = express();
const static = express.static(__dirname + "/public");
var cookieParser = require('cookie-parser');
var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('connect-flash');


const configRoutes = require("./routes");
const exphbs = require("express-handlebars");

// require('./passportConfig/passport');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({secret: 'mysupersecret', resave: false, saveUninitialized: false}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// View engine setup
app.engine('.hbs', exphbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.get('*', function(req, res, next) {
  res.locals.user = req.user || null;
  console.log(res.locals.user);
  next();
});

configRoutes(app);

require('./routes/index')(app, passport);
require('./routes/passport')(passport);

app.listen(3001, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
