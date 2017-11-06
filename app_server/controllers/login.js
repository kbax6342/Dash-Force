var request = require('request');
var userModel = require('./../../app_api/models/user');
var mongoose = require('mongoose');
var user = mongoose.model('user');
var passport = require('passport');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var apiOptions = {
  server: "http://localhost:3000"
};

if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://DashForce.herokuapp.com";
}

var renderLoginForm = function(req, res, next) {
  res.render('index', { title: 'Login'});
};

module.exports.login = function(req, res, next) {
  renderLoginForm(req, res, next);
};

module.exports.authUser = function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
          // If Passport throws/catches an error
          if (err) {
            res.status(404).json(err);
            return;
          } else {
            req.session.userId = user._id;
            return res.redirect('/dashboard');
          }
        })(req, res, next);
};
