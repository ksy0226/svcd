'use strict';

const express = require('express');
const router = express.Router();

const controller = require('../controllers/statistic');

router.route('/com_higher').get(controller.com_higher);
router.route('/high_lower').get(controller.high_lower);
router.route('/mng_month').get(controller.mng_month);
router.route('/status_list').get(controller.status_list);

module.exports = router;
