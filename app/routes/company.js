'use strict';

const express = require('express');
const router = express.Router();
const ssc = require('../util/session');
const controller = require('../controllers/company');

router.route('/new').get(ssc.sessionCheck,controller.new)
                    .post(ssc.sessionCheck,controller.save);
router.route('/list').get(ssc.sessionCheck,controller.list);
router.route('/:id/show').get(ssc.sessionCheck,controller.show);
router.route('/:id/edit').get(ssc.sessionCheck,controller.edit)
                         .post(ssc.sessionCheck,controller.update);
router.route('/:id/save').post(ssc.sessionCheck,controller.update);
router.route('/:id/delete').get(ssc.sessionCheck,controller.delete);

router.route('/exceldownload').get(ssc.sessionCheck,controller.exceldownload);

module.exports = router;
