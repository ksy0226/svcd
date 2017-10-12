'use strict';

const mongoose = require('mongoose');
const async = require('async');
const HigherProcessModel = require('../models/HigherProcess');
const OftenQnaModel = require('../models/OftenQna');
const service = require('../services/oftenqna');
const logger = require('log4js').getLogger('app');
const Iconv = require('iconv-lite');

module.exports = {

    index: (req, res, next) => {
        var search = service.createSearch(req);

        async.waterfall([function (callback) {
            HigherProcessModel.find(search.findOftenqna, function (err, higherprocess) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                }
                callback(null, higherprocess)
            });
        }], function (err, higherprocess) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
                res.render("oftenqna/index", {
                    higherprocess: higherprocess
                });
            }
        });
    },

    new: (req, res, next) => {
        async.waterfall([function (callback) {
            HigherProcessModel.find({}, function (err, higher) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                }
                callback(null, higher)
            });
        }], function (err, higher) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
                res.render("oftenqna/new", {
                    higher: higher
                });
            }
        });
    },

    save: (req, res, next) => {
        logger.debug('save start >>>>>>> ' + req);
        var newOftenqna = req.body.oftenqna;

        if (req.files) {
            newOftenqna.attach_file = req.files;
        }
        OftenQnaModel.create(newOftenqna, function (err, newOftenqna) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
                res.redirect('/oftenqna');
            }
        });
    },

    edit: (req, res, next) => {
        OftenQnaModel.findById(req.params.id, function (err, oftenqna) {
            if (err) return res.json({
                success: false,
                message: err
            });
            res.render("oftenqna/edit", {
                oftenqna: oftenqna
            });
        });
    },

    update: (req, res, next) => {
        OftenQnaModel.findOneAndUpdate({
            _id: req.params.id
        }, req.body.oftenqna, function (err, oftenqna) {
            if (err) return res.json({
                success: false,
                message: err
            });
            if (!oftenqna) return res.json({
                success: false,
                message: "No data found to update"
            });
            res.redirect('/oftenqna/edit/' + req.params.id);
        });
    },

    delete: (req, res, next) => {
        OftenQnaModel.findOneAndRemove({
            _id: req.params.id
        }, function (err, oftenqna) {
            if (err) return res.json({
                success: false,
                message: err
            });
            if (!oftenqna) return res.json({
                success: false,
                message: "No data found to delete"
            });
            res.redirect('/oftenqna');
        });
    },

    /**
     * summernote 이미지링크 처리
     */
    insertedImage: (req, res, next) => {
        logger.debug("=====================>incident controllers insertedImage");
        res.send(req.file.filename);
    },
};
