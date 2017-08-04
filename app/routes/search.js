'use strict';

const express = require('express');
const router = express.Router();

const controller = require('../controllers/search');

router.route('/viewall').get(controller.viewall);

//router.route('/:id/viewdetail').get(controller.viewdetail)
router.route('/viewdetail').get(controller.viewdetail)

module.exports = router;
