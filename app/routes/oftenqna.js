'use strict';

const express = require('express');
const router = express.Router();
const ssc = require('../util/session');
const logger = require('log4js').getLogger('app');
const upload = require('../util/multer');
const upload2 = require('../util/multer2');

const controller = require('../controllers/oftenQna');

router.route('/').get(ssc.sessionCheck, controller.index);
router.route('/new').get(ssc.sessionCheck, controller.new)
                    .post(upload.array('incident[attach-file]'), ssc.sessionCheck, controller.save);
router.route('/edit/:id').get(ssc.sessionCheck, controller.edit)
                         .post(ssc.sessionCheck, controller.update);
router.route('/save/:id').get(ssc.sessionCheck, controller.update);
router.route('/insertedImage').post(upload2.array('insertedImage'), ssc.sessionCheck, controller.insertedImage);
router.route('/delete/:id').get(ssc.sessionCheck, controller.delete);
router.route('/download/:path1/:path2').get(ssc.sessionCheck, controller.download);

module.exports = router;
