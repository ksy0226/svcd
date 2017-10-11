'use strict';

const express = require('express');
const router = express.Router();

const controller = require('../controllers/search');

router.route('/user_list').get(controller.user_list);
router.route('/user_detail/:id').get(controller.user_detail);
router.route('/qna').get(controller.qna);
router.route('/mng_list').get(controller.mng_list);
router.route('/remain_list').get(controller.remain_list);
router.route('/status_list').get(controller.status_list);
router.route('/getlowerprocess').get(controller.getlowerprocess);
router.route('/list').get(controller.list);


module.exports = router;
