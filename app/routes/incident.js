'use strict';

const express = require('express');
const router = express.Router();
const ssc = require('../util/session');
const logger = require('log4js').getLogger('app');
const upload = require('../util/multer');

const controller = require('../controllers/incident');

router.route('/').get(ssc.sessionCheck, controller.index);
//                 .post(controller.index);
//router.route('/:searchType/:searchText').get(controller.index);
router.get('/new/:title', ssc.sessionCheck, controller.new)
router.post('/new', upload.array('incident[attach-file]'), ssc.sessionCheck, controller.save);
//router.get('/show/:id', ssc.sessionCheck, controller.show);
router.get('/show', ssc.sessionCheck, controller.show);
router.get('/edit/:id', ssc.sessionCheck, controller.edit)
router.put('/edit/:id', ssc.sessionCheck, controller.update);
router.delete('/delete/:id', ssc.sessionCheck, controller.delete);

router.get('/viewDetail/:id', ssc.sessionCheck, controller.viewDetail);
router.get('/viewDetail/download/:id/:filename', ssc.sessionCheck, controller.download);

module.exports = router;
