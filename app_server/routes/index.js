var express = require('express');
var router = express.Router();


var ctrlDashboard = require('../controllers/dashboard');
var ctrlLogin = require('../controllers/login');
var ctrlRegistration = require('../controllers/registration')

/* GET login. */
router.get('/', ctrlLogin.login);

router.post('/', ctrlLogin.authUser);


/* GET Registration */
router.get('/register', ctrlRegistration.register);

router.post('/register', ctrlRegistration.createNewUser);

/* GET Dashboard. */
router.get('/dashboard', ctrlDashboard.renderDashboard);


module.exports = router;
