var request = require('request');
var userModel = require('./../../app_api/models/user');
var mongoose = require('mongoose');
var user = mongoose.model('user');


var apiOptions = {
  server: "http://localhost:3000"
};
if(process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://DashForce.herokuapp.com";
}

module.exports.renderDashboard = function(req, res, next) {
  // If user is not authorized
  if (!req.session.userId) {
    var err = new Error("You are not authorized to view this page");
    err.status = 403;
    return next(err);
  }
  user
    .findById(req.session.userId)
    .exec(function(error, user) {
      if(error) {
        return next(error);
      } else {
        return res.render('main-dashboard', {
          title: 'Dashboard',
          username: user.firstName,
          firstName: user.firstName,
          lastName: user.lastName,


        });
      }
    });
};
