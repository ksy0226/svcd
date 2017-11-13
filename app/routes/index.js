var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("index");
var ssc = require('../util/session');
//require('../util/cookie');

const controller = require('../controllers/login');

/* GET home page. */
router.get('/', ssc.sessionCheck, controller.index);

router.route('/index').post(controller.logincheck)
                      .get(ssc.sessionCheck, controller.retry);
router.route('/new').post(controller.new);
router.route('/index1').get(controller.index1);  
router.route('/index2').get(controller.index2);
router.route('/logout').get(controller.logout);
router.route('/login/main_list').get(ssc.sessionCheck, controller.main_list);

module.exports = router;
