var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var session = require('express-session');
var methodOverride = require('method-override');
var config = require('./config');
var routes = require('../app/routes/');
var db = require('./db');


routes(router);

app.use(bodyParser.json());

app.use(morgan('dev'));

app.use(session({
  saveUninitialized: false,
  secret: 'rosco',
  resave: false
}));

app.use(bodyParser.json({
  type: 'application/vnd.api+json'
}));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(methodOverride('X-HTTP-Method-Override'));

app.use(cookieParser());

app.use('/api', router);

module.exports = app;