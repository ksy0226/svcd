'use strict';

const express = require('express');
const router = express.Router();
const ssc = require('../util/session');
const controller = require('../controllers/companyBusiness');

router.route('/').get(ssc.sessionCheck, controller.index);
router.route('/new').get(ssc.sessionCheck, controller.new)
                    .post(ssc.sessionCheck, controller.save);
router.route('/edit/:id').get(ssc.sessionCheck, controller.edit)
                         .post(ssc.sessionCheck, controller.update);
router.route('/save/:id').get(ssc.sessionCheck, controller.update);
router.route('/delete/:id').get(ssc.sessionCheck, controller.delete);

module.exports = router;