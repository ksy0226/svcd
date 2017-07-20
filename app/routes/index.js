var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("index");
var ssc = require('../util/session');
require('../util/cookie');

const controller = require('../controllers/login');

/* GET home page. */
router.get('/', ssc.sessionCheck);

router.route('/index').post(controller.logincheck)
                           .get(ssc.sessionCheck, controller.retry);                           
router.route('/logout').get(controller.logout);



module.exports = router;
