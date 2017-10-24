'use strict';

const express = require('express');
const router = express.Router();

const controller = require('../controllers/search');

router.route('/user_list').get(controller.user_list);
router.route('/user_detail/:id').get(controller.user_detail);
router.route('/user_qna').get(controller.user_qna);
router.route('/mng_list').get(controller.mng_list);
router.route('/mng_detail/:id').get(controller.mng_detail);
router.route('/remain_list').get(controller.remain_list);
router.route('/status_list').get(controller.status_list);
router.route('/getlowerprocess').get(controller.getlowerprocess);
router.route('/list').get(controller.list);
router.route('/getqnalist').get(controller.getqnalist);
router.route('/qna_detail/:id').get(controller.qna_detail);
router.route('/download/:path1/:path2').get(controller.download);


module.exports = router;
