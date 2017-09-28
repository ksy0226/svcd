'use strict';

const express = require('express');
const router = express.Router();

const controller = require('../controllers/search');

router.route('/viewall').get(controller.viewall);
router.route('/viewdetail').get(controller.viewdetail);
router.route('/qna').get(controller.qna);
router.route('/searchall').get(controller.searchall);
router.route('/comhigherstatistic').get(controller.comhigherstatistic);
router.route('/highlowerstatistic').get(controller.highlowerstatistic);
router.route('/remainlist').get(controller.remainlist);
router.route('/managermonthlist').get(controller.managermonthlist)
router.route('/gubunlist').get(controller.gubunlist);



module.exports = router;
