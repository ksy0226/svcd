'use strict';

const mongoose = require('mongoose');
const async = require('async');
const LowerProcessModel = require('../models/LowerProcess');
const HigherProcessModel = require('../models/HigherProcess');
const CompanyModel = require('../models/Company');
const logger = require('log4js').getLogger('app');
const Iconv = require('iconv-lite');

module.exports = {

    index: (req, res, next) => {
        LowerProcessModel.find(req.body.lowerProcess, function (err, lowerProcess) {
            logger.debug('index 호출');
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
                //if(lowerProcess.created_at != '') lowerProcess.created_at = lowerProcess.created_at.substring(0,10);
                //if(lowerProcess.register_date != '') lowerProcess.register_date = lowerProcess.register_date.substring(0,10);
                
                res.render("lowerProcess/index", {
                    lowerProcess: lowerProcess
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
        }, function (higher, callback) {
            CompanyModel.find({}, function (err, company) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                }
                callback(null, higher, company)
            });
        }], function (err, higher, company) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
                res.render("lowerProcess/new", {
                    higher: higher,
                    company : company
                });
            }
        });
    },

    save: (req, res, next) => {
        var lowerProcess = req.body.lowerProcess;
        LowerProcessModel.create(req.body.lowerProcess, function (err, lowerProcess) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
                res.redirect('/lowerProcess');
            }
        });
    },

    edit: (req, res, next) => {
        LowerProcessModel.findById(req.params.id, function (err, lowerProcess) {
            if (err) return res.json({
                success: false,
                message: err
            });
            res.render("lowerProcess/edit", {
                lowerProcess: lowerProcess
            });
        });
    },

    update: (req, res, next) => {
        LowerProcessModel.findOneAndUpdate({
            _id: req.params.id
        }, req.body.lowerProcess, function (err, lowerProcess) {
            if (err) return res.json({
                success: false,
                message: err
            });
            if (!lowerProcess) return res.json({
                success: false,
                message: "No data found to update"
            });
            res.redirect('/lowerProcess/edit/' + req.params.id);
        });
    },

    delete: (req, res, next) => {
        LowerProcessModel.findOneAndRemove({
            _id: req.params.id
        }, function (err, lowerProcess) {
            if (err) return res.json({
                success: false,
                message: err
            });
            if (!lowerProcess) return res.json({
                success: false,
                message: "No data found to delete"
            });
            res.redirect('/lowerProcess');
        });
    }
};
