'use strict';

const express = require('express');
const router = express.Router();

const controller = require('../controllers/manager');

router.route('/work_list').get(controller.work_list);
router.route('/work_detail/:id').get(controller.work_detail);
router.route('/saveReceipt/:id').post(controller.saveReceipt);
router.route('/work_assign').get(controller.work_assign);
router.route('/month_list').get(controller.month_list);
router.route('/com_process').get(controller.com_process);

module.exports = router;
