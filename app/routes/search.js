'use strict';

const express = require('express');
const router = express.Router();

const controller = require('../controllers/search');

router.route('/viewall').get(controller.viewall);

module.exports = router;
