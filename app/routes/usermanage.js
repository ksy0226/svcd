'use strict';

const express = require('express');
const router = express.Router();


const controller = require('../controllers/usermanage');

/*
router.get('/', controller.index);
router.post('/', controller.save);
router.get('/new', controller.new);
router.get('/show/:id', controller.show);
router.get('/edit/:id', controller.edit);
router.post('/edit/:id', controller.update);
router.get('/delete/:id', controller.delete);
*/

router.route('/').get(controller.usermanageIndex);
//                 .post(controller.index);
//router.route('/:searchType/:searchText').get(controller.index);
router.route('/usermanageNew').get(controller.usermanageNew)
                              .post(controller.usermanageSave);

router.route('/:id/usermanageShow').get(controller.usermanageShow);
router.route('/:id/usermanageEdit').get(controller.usermanageEdit)
                         .post(controller.usermanageUpdate);
router.route('/:id/usermanageDelete').get(controller.usermanageDelete);


module.exports = router;
