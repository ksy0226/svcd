'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/usermanage');
const logincontroller = require('../controllers/login');

router.route('/').get(controller.index);
router.route('/new').get(controller.new)
                    .post(controller.save);
router.route('/:id/edit').get(controller.edit)
                         .post(controller.update);
router.route('/:id/delete').get(controller.delete);
router.route('/sendmail').get(controller.sendmail);

module.exports = router;
