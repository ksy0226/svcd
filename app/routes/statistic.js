'use strict';

const express = require('express');
const router = express.Router();
const ssc = require('../util/session');
const controller = require('../controllers/statistic');

router.route('/com_higher').get(ssc.sessionCheck, controller.com_higher);
router.route('/high_lower').get(ssc.sessionCheck, controller.high_lower);
router.route('/mng_month').get(ssc.sessionCheck, controller.mng_month);
router.route('/status_list').get(ssc.sessionCheck, controller.status_list);
router.route('/cntload').get(ssc.sessionCheck, controller.cntload);
router.route('/chartLoad').get(ssc.sessionCheck, controller.chartLoad);
router.route('/monthlyload').get(ssc.sessionCheck, controller.monthlyload);
router.route('/deptcntload').get(ssc.sessionCheck, controller.cntload);
router.route('/deptmonthlyLoad').get(ssc.sessionCheck, controller.monthlyload);
router.route('/deptchartLoad').get(ssc.sessionCheck, controller.chartLoad);
router.route('/getHighLower').get(ssc.sessionCheck, controller.getHighLower);
router.route('/getComHigher').get(ssc.sessionCheck, controller.getComHigher);
router.route('/userCntLoad').get(ssc.sessionCheck, controller.cntload);

module.exports = router;
