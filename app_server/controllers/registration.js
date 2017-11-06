var request = require('request');
var apiOptions = {
  server: "http://localhost:3000"
};
if(process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://DashForce.herokuapp.com";
}


var renderRegistrationForm = function(req, res, next) {
  res.render('registration', { title: 'Register'});
};

module.exports.register = function(req, res, next) {
  renderRegistrationForm(req, res, next)
};

module.exports.createNewUser = function(req, res, next) {
  var requestOptions, path, postdata;
  path = "/api/register";

  postdata = {
    username: req.body.firstName + req.body.lastName,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password
  };

  requestOptions = {
    url: apiOptions.server + path,
    method: "POST",
    json: postdata
  };

  request(requestOptions, function(err, response, body) {
    if(response.statusCode === 201) {
      res.redirect('/');
    } else {
      // error handling Requires callback a
    }
  });
};
