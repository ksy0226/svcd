'use strict';

const express = require('express');
const router = express.Router();
const ssc = require('../util/session');
const logger = require('log4js').getLogger('app');
const multer = require('multer');

const controller = require('../controllers/incident');


var path = require('path');
//var uploadDir = path.join( __dirname , '/upload-file' );
var uploadDir = path.join('D:/999.prj-nodejs/svcd/upload-file' );
var storage = multer.diskStorage({
    destination : function (req, file, callback) {
        callback(null, uploadDir);
    },
    filename : function (req, file, callback) {
        callback(null, 'posts-' + Date.now() + '.'+ file.mimetype.split('/')[1] );
    }
});
var upload = multer({ storage: storage });
     

 router.route('/').get(ssc.sessionCheck, controller.index);
//                 .post(controller.index);
//router.route('/:searchType/:searchText').get(controller.index);
router.get('/new/:title', ssc.sessionCheck, controller.new)
router.post('/new', upload.array('incident[attach-file]'), ssc.sessionCheck, controller.save);             
router.get('/show/:id', ssc.sessionCheck, controller.show);
router.get('/edit/:id', ssc.sessionCheck, controller.edit)
router.put('/edit/:id', ssc.sessionCheck, controller.update);
router.delete('/delete/:id', ssc.sessionCheck, controller.delete);

module.exports = router;
