'use strict';

const express = require('express');
const router = express.Router();
const ssc = require('../util/session');
const logger = require('log4js').getLogger('app');
const upload = require('../util/multer');

const controller = require('../controllers/incident');

router.route('/').get(ssc.sessionCheck, controller.index);
router.route('/list').get(ssc.sessionCheck, controller.getIncident);
router.route('/new/:title').get(ssc.sessionCheck, controller.new);
router.route('/new').post(upload.array('incident[attach-file]'), ssc.sessionCheck, controller.save);
router.route('/viewDetail/:id').get(ssc.sessionCheck, controller.viewDetail);
router.route('/viewDetail/download/:id/:filename').get(ssc.sessionCheck, controller.download);

module.exports = router;
