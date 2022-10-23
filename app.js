const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const port = process.env.PORT;
const mongoose = require('mongoose');
require('dotenv').config();

var usersRouter = require('./routes/users');
var todosRouter = require('./routes/todos');


// db connection
mongoose.connect('mongodb://localhost/tutorbin',
{useNewUrlParser: true, useUnifiedTopology: true},
(err) => console.log(err ? err : "Database is connected!"));

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', usersRouter);
app.use('/api/todos', todosRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({err});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


module.exports = app;
