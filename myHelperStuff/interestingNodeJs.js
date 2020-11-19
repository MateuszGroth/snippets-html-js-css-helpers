var express = require('express');
var helmet = require('helmet');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var env = dotenv.load();
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var session      = require('express-session');
var cors = require('cors');

var databaseUrl = require('./config/database.js')[process.env.NODE_ENV || 'development'];
// configuration 
mongoose.connect(databaseUrl); // connect to our database

var app = express();

// app.use(helmet());

// required for passport


app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  if ('OPTIONS' == req.method) {
       res.send(200);
   } else {
       next();
   }
});


app.use(cookieParser());

app.use(session({
    secret: 'ilovescotchscotchyscotchscotch', // session secret
    resave: true,
    saveUninitialized: true,
    name: 'Session-Id',
    cookie: {
      secure: false,
      httpOnly: false
    }
}));


require('./config/passport')(passport); // pass passport for configuration

var index = require('./routes/index');
var users = require('./routes/user.route');
var seeders = require('./routes/seeder.route');
var branches = require('./routes/branch.route');
var companies = require('./routes/company.route');
var dashboard = require('./routes/dashboard.route');
var navigation = require('./routes/navigation.route');
var roles = require('./routes/role.route');
var services = require('./routes/services.route');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./routes/auth.route')(app, passport);
app.use('/', index);
app.use('/users', users);
app.use('/seed', seeders);
app.use('/branches', branches);
app.use('/companies', companies);
app.use('/dashboard', dashboard);
app.use('/navigation', navigation);
app.use('/roles', roles);
app.use('/services', services);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).send({ status: 'NOT_FOUND', message: 'This resource is not available.'});
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  let errorObj = { 
    status: 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrong.',
    error: err.message
  };
  res.status(err.status || 500).send(errorObj);
});

module.exports = app;