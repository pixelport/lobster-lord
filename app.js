var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

var indexRouter = require('./routes/index');
var connectionRouter = require('./routes/connection');
var execRouter = require('./routes/exec');

var config = require('./config.json')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, './client/build')));

var fileStoreOptions = {
  path: path.join(__dirname, './session')
};

app.use(session({
  resave: false,
  secret: config.secret,
  store: new FileStore(fileStoreOptions),
  saveUninitialized: false,
  expires: new Date(2147483647 * 1000)
}));

app.use('/', indexRouter);
app.use('/connection', connectionRouter);
app.use('/exec', execRouter);

app.use('/key/*', function(req, res, next){
  res.sendFile(path.join(__dirname, './client/build/index.html'))
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// initiales laden: redis scan
