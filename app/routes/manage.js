'use strict';

const express = require('express');
const router = express.Router();


const controller = require('../controllers/manage');

/* GET home page. */
//router.get('/', ssc.sessionCheck);

////router.route('/index').post(controller.logincheck)
                         //  .get(ssc.sessionCheck, controller.retry);                           
//router.route('/logout').get(controller.logout);
router.route('/company').get(controller.show);
router.route('/companyNew').get(controller.new);

module.exports = router;
