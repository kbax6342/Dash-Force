var express = require('express');
var app = express();
var mongoose = require('mongoose');
var userModel = require('../models/user');
var user = mongoose.model('user');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

// ==== GET ====

// GET all users
module.exports.userlist = function(req, res) {
  user
    .find()
    .exec(function(err, user) {
      sendJsonResponse(res, 200, user);
    });
};

// GET one user
module.exports.username = function(req, res) {
  if (req.params && req.params.userid) {
    user
      .findById(req.params.userid)
      .exec(function(err, user) {
        // If no user document matches userid then send 404 wiith message
        if (!user) {
          sendJsonResponse(res, 404, { "message": "userid not found"});
          return;
        }
        // If an error occurs send 404 with err message
        else if (err) {
            sendJsonResponse(res, 404, err);
            return;
        }
        // If everything works properly send 200 and user document as json
          sendJsonResponse(res, 200, user);
      });
    }
    // If no userid is passed in url parameters send 404 with message
    else {
      sendJsonResponse(res, 404, { "message": "No userid in request"});
    }
};

// GET timesheets for one user
module.exports.timesheets = function(req, res) {
  if (req.params && req.params.userid) {
    user
      .findById(req.params.userid)
      .select('user timesheet')
      .exec(function(err, user) {
        if (user) {
          if (user.timesheet > 0) {
            sendJsonResponse(res, 200, user);
          } else {
            sendJsonResponse(res, 404, {
              "message": "timesheets not found"
            });
          }
        } else {
          sendJsonResponse(res, 404, {
            "message": "user was not found"
          })
        }
        });
    }

    else {
      sendJsonResponse(res, 404, { "message": "No userid in request"});
    }
};

module.exports.oneTimesheet = function(req, res) {
  if (req.params && req.params.userid && req.params.timesheetid) {
    user
      .findById(req.params.userid)
      .select('username timesheet')
      .exec(
        function(err, user) {
          var response, timesheet;
          if(!user) {
            sendJsonResponse(res, 404, {
              "message": "userid not found"
            });
            return;
          }
          if (user.timesheet && user.timesheet.length > 0 ) {
            timesheet = user.timesheet.id(req.params.timesheetid);
            if (!timesheet) {
              sendJsonResponse(res, 404, {
                "message": "timesheetid not found"
              });
            } else {
              response = {
                user : {
                  username: user.username,
                  id: req.params.userid
                },
                timesheet: timesheet
              };
              sendJsonResponse(res, 200, response);
            }
          } else {
            sendJsonResponse(res, 404, {
              "message": "No timesheets found"
            });
          }
        }
      );
} else {
  sendJsonResponse(res, 404, {
    "message": "Not found, userid and timesheetid are both required"
  });
}
};
// ==== POST ====

// POST new user
module.exports.createUser = function(req, res) {
  user.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password
  }, function(err, user) {
    if (err) {
      sendJsonResponse(res, 400, err);
    } else {
      sendJsonResponse(res, 201, user);
    }
  });
};

// Function required for new timesheet POST
var doAddTimesheet = function(req, res, user) {
  if (!user) {
    sendJsonResponse(res, 404, {
      "message": "userid not found"
    });
  } else {
    user.timesheet.push({
      date: req.body.date,
      clockin: req.body.clockin,
      clockout: req.body.clockout,
      totalHours: req.body.totalHours
    });
    user.save(function(err, user) {
      var thisTimesheet;
      if (err) {
        sendJsonResponse(res, 400, err);
      } else {
        thisTimesheet = user.timesheet[user.timesheet.length - 1];
        sendJsonResponse(res, 201, thisTimesheet);
      }
    });
  }
};

// POST new timesheet for user
module.exports.createTimesheet = function (req, res) {
  var userid = req.params.userid;
  if (userid) {
    user
      .findById(userid)
      .select('timesheet')
      .exec( function(err, user) {
          if (err) {
            sendJsonResponse(res, 400, err);
          } else {
            doAddTimesheet(req,res,user);
          }
        }
      );
  } else {
    sendJsonResponse(res, 404, {
      "message": "Not found, userid required"
    });
  }
};

// ==== PUT ====

// PUT update user information
module.exports.updateUser = function(req, res) {
  if (!req.params.userid) {
    sendJsonResponse(res, 404, {
      "message": "Not found, user is required"
    });
    return;
  }
  user
    .findById(req.params.userid)
    .select('-timesheets')
    .exec(
      function(err, user) {
        if (!user) {
          sendJsonResponse(res, 404, {
            "message": "userid not found"
          });
          return;
        } else if (err) {
          sendJsonResponse(res, 400, err);
          return;
        }
        // Update fields
        user.username = req.body.username;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        user.phoneNumber = req.body.phoneNumber;
        user.location = req.body.location;
        // Save document
        user.save(function(err, user) {
          if (err) {
            sendJsonResponse(res, 404, err);
          } else {
            sendJsonResponse(res, 200, user);
          }
        });
      }
    );
};

// PUT update timesheet by id

// ==== DELETE ====

// ==== DELETE USER ====
module.exports.userDeleteOne = function(req, res) {
var userid = req.params.userid;
  if (userid) {
    user
      .findById(userid)
      .exec(
        function (err, location) {
          if (err) {
            sendJsonResponse(res, 404, err);
            return;
          }
          // Do something with the document
          user.remove(function(err, user){
            if (err) {
              sendJsonResponse(res, 404, err);
              return;
            }
            sendJsonResponse(res, 204, null);
                  });
    });
  } else {
    sendJsonResponse(res, 404, {
      "message": "No userid"
        });
       }
    };

module.exports.timesheetDeleteOne = function(req, res) {
  if ( !req.params.userid || !req.params.timesheetid ) {
    sendJsonResponse(res, 404, {
      "message": "Not found. Both userid and timesheetid are required"
    });
  }
  user
    .findById(req.params.userid)
    .exec(function(err, user) {
      if (!user) {
        sendJsonResponse(res, 404, {
          "message": "userid not found"
        });
        return;
      } else if (err) {
        sendJsonResponse(res, 404, err);
        return;
      }
      if (user.timesheet && user.timesheet.length > 0) {
        if(!user.timesheet.id(req.params.timesheetid)) {
          sendJsonResponse(res, 404, {
            "message": "timesheetid not found"
          });
        } else {
          user.timesheet.id(req.params.timesheetid).remove();
          user.save(function(err) {
            if (err) {
              sendJsonResponse(res, 404, err);
            } else {
              sendJsonResponse(res, 204, null);
            }
          });
        }
      } else {
        sendJsonResponse(res, 404, {
          "message": "no timesheet to delete"
        });
      }
    });
};
