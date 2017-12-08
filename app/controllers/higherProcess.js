'use strict';

const mongoose = require('mongoose');
const async = require('async');
const HigherProcessModel = require('../models/HigherProcess');
const service = require('../services/higherProcess');
const logger = require('log4js').getLogger('app');

module.exports = {

    index: (req, res, next) => {
        HigherProcessModel.find(req.body.higherProcess, function (err, higherProcess) {
            logger.debug('list 호출');
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
                res.render("higherProcess/index", {
                    higherProcess: higherProcess
                });
            }
        });
    },

    new: (req, res, next) => {
        res.render("higherProcess/new");
    },

    save: (req, res, next) => {
        var higherProcess = req.body.higherProcess;
        logger.debug('body', req.body);

        HigherProcessModel.create(req.body.higherProcess, function(err, higherProcess) {
            //logger.debug('err', err, '\n');
            logger.debug('save 호출');    
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }
        });
        res.redirect('/higherProcess/');
    },


    edit: (req, res, next) => {
        HigherProcessModel.findById(req.params.id, function(err, higherProcess) {
            if (err) return res.json({
                success: false,
                message: err
            });
            //if (!req.user._id.equals(question.author)) return res.json({
            //    success: false,
            //    message: "Unauthrized Attempt"
            //});
            res.render("higherProcess/edit", {
                higherProcess: higherProcess
                //,user: req.user
            });
        });
    },

    update: (req, res, next) => {
        HigherProcessModel.findOneAndUpdate({
            _id: req.params.id
        }, req.body.higherProcess, function(err, higherProcess) {
            if (err) return res.json({
                success: false,
                message: err
            });
            if (!higherProcess) return res.json({
                success: false,
                message: "No data found to update"
            });
            res.redirect('/higherProcess/');
        });
    },

    delete: (req, res, next) => {
        HigherProcessModel.findOneAndRemove({
            _id: req.params.id
        }, function(err, higherProcess) {
            if (err) return res.json({
                success: false,
                message: err
            });
            if (!higherProcess) return res.json({
                success: false,
                message: "No data found to delete"
            });
            res.redirect('/higherProcess/');
        });
    },

    list: (req, res, next) => {
        var search = service.createSearch(req);

        async.waterfall([function (callback) {
            HigherProcessModel.find(search.findHigherProcess, function (err, higherProcess) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    });
                } else {
                    /*
                    logger.debug("==========================================gethigherProcess=======================================");
                    logger.debug("higherProcess : ", higherProcess);
                    logger.debug("================================================================================================");
                    */

                    callback(null, higherProcess);
                }
            }).sort('higher_cd');
        }], function (err, higherProcess) {
            if (err) {
                return res.json({
                    success: false,
                    message: err
                });
            } else {
                /*
                logger.debug("==========================================gethigherProcess=======================================");
                logger.debug("higherProcess list : ", JSON.stringify(higherProcess));
                logger.debug("==================================================+++===========================================");
                */

                res.send(higherProcess);
            }
        });
    },
};
