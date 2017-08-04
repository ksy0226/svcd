'use strict';

const express = require('express');
const router = express.Router();

const controller = require('../controllers/company');

router.route('/new').get(controller.new)
                    .post(controller.save);
router.route('/list').get(controller.list);
router.route('/:id/show').get(controller.show);
router.route('/:id/edit').get(controller.edit)
                         .post(controller.update);
router.route('/:id/save').post(controller.update);
router.route('/:id/delete').get(controller.delete);

module.exports = router;
