var express = require('express');
var router = express.Router();

var ctrlUser = require('../controllers/user');

// ===== GET =====
// gets all user documents
router.get('/user', ctrlUser.userlist)

// GET a user document
router.get('/user/:userid', ctrlUser.username);

// GET all timesheets for a user
router.get('/user/:userid/timesheet', ctrlUser.timesheets);

// GET one timesheet for a user
router.get('/user/:userid/timesheet/:timesheetid', ctrlUser.oneTimesheet);


// ==== POST ====

// POST new user
router.post('/register', ctrlUser.createUser);

// POST new timesheet for user
router.post('/user/:userid/timesheet', ctrlUser.createTimesheet);

// ===== PUT ====
router.put('/user/:userid', ctrlUser.updateUser);

module.exports = router;

// ===== DELETE ====
router.delete('/user/:userid', ctrlUser.userDeleteOne);

router.delete('/user/:userid/timesheet/:timesheetid', ctrlUser.timesheetDeleteOne);
