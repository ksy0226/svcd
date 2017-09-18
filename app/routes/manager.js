'use strict';

const express = require('express');
const router = express.Router();

const controller = require('../controllers/manager');

router.route('/myworklist').get(controller.myworklist);
router.route('/mywork').get(controller.mywork);
router.route('/mymonthlist').get(controller.mymonthlist);
router.route('/companywork').get(controller.companywork);

module.exports = router;
