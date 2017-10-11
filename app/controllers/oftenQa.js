'use strict';

const mongoose = require('mongoose');
const async = require('async');
const HigherProcessModel = require('../models/HigherProcess');
const OftenQaModel = require('../models/OftenQa');
const logger = require('log4js').getLogger('app');
const Iconv = require('iconv-lite');

module.exports = {

    index: (req, res, next) => {
        /*
        OftenQaModel.find(req.body.oftenqa, function (err, oftenqa) {
            logger.debug('index 호출');
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
                res.render("oftenqa/index", {
                    oftenqa: oftenqa
                });
            }
        });
        */

        async.waterfall([function (callback) {
            HigherProcessModel.find({},function (err, higherprocess) {
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
            }else{
                res.render("oftenqa/index", {
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
                res.render("oftenqa/new", {
                    higher: higher
                });
            }
        });
    },

    save: (req, res, next) => {
        var oftenqa = req.body.oftenqa;
        OftenQaModel.create(req.body.oftenqa, function (err, oftenqa) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
                res.redirect('/oftenqa');
            }
        });
    },

    edit: (req, res, next) => {
        OftenQaModel.findById(req.params.id, function (err, oftenqa) {
            if (err) return res.json({
                success: false,
                message: err
            });
            res.render("oftenqa/edit", {
                oftenqa: oftenqa
            });
        });
    },

    update: (req, res, next) => {
        OftenQaModel.findOneAndUpdate({
            _id: req.params.id
        }, req.body.oftenqa, function (err, oftenqa) {
            if (err) return res.json({
                success: false,
                message: err
            });
            if (!oftenqa) return res.json({
                success: false,
                message: "No data found to update"
            });
            res.redirect('/oftenqa/edit/' + req.params.id);
        });
    },

    delete: (req, res, next) => {
        OftenQaModel.findOneAndRemove({
            _id: req.params.id
        }, function (err, oftenqa) {
            if (err) return res.json({
                success: false,
                message: err
            });
            if (!oftenqa) return res.json({
                success: false,
                message: "No data found to delete"
            });
            res.redirect('/oftenqa');
        });
    }
};
