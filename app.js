// const createError = require('http-errors');
require('dotenv').config()
const express = require('express');
const passport = require('passport');
const path = require('path');
// const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose   = require('mongoose');
// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
const v1Authes = require('./modules/authentication/v1/routes');
const v1DesignRoutes = require('./modules/designs/v1/routes');
const app = express();
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/v1/auth/', v1Authes);
app.use('/v1/designs/', passport.authenticate("jwt", {session: false}), v1DesignRoutes);
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
