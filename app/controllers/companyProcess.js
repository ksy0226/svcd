'use strict';

const mongoose = require('mongoose');
const async = require('async');
const CompanyProcessModel = require('../models/CompanyProcess');
const HigherProcessModel = require('../models/HigherProcess');
const CompanyModel = require('../models/Company');
const logger = require('log4js').getLogger('app');
const Iconv = require('iconv-lite');

module.exports = {

    index: (req, res, next) => {
        async.waterfall([function (callback) {
            HigherProcessModel.find({}, function (err, higherprocess) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                }
                callback(null, higherprocess)
            });
        }, function (higherprocess, callback) {
            CompanyModel.find({}, function (err, company) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                }
                callback(null, higherprocess, company)
            });
        }, function (higherprocess, company, callback) {
            CompanyProcessModel.find(req.body.companyProcess, function (err, companyProcess) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                }
                callback(null, higherprocess, company, companyProcess)
            });
        }], function (err, higherprocess, company, companyProcess) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
                res.render("companyProcess/index", {
                    higherprocess: higherprocess,
                    company: company,
                    companyProcess: companyProcess
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
                res.render("companyProcess/new", {
                    higher: higher,
                    company: company
                });
            }
        });
    },

    save: (req, res, next) => {
        var companyProcess = req.body.companyProcess;
        CompanyProcessModel.create(req.body.companyProcess, function (err, companyProcess) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
                res.redirect('/companyProcess');
            }
        });
    },

    edit: (req, res, next) => {
        CompanyProcessModel.findById(req.params.id, function (err, companyProcess) {
            if (err) return res.json({
                success: false,
                message: err
            });
            res.render("companyProcess/edit", {
                companyProcess: companyProcess
            });
        });
    },

    update: (req, res, next) => {
        CompanyProcessModel.findOneAndUpdate({
            _id: req.params.id
        }, req.body.companyProcess, function (err, companyProcess) {
            if (err) return res.json({
                success: false,
                message: err
            });
            if (!companyProcess) return res.json({
                success: false,
                message: "No data found to update"
            });
            res.redirect('/companyProcess/edit/' + req.params.id);
        });
    },

    delete: (req, res, next) => {
        CompanyProcessModel.findOneAndRemove({
            _id: req.params.id
        }, function (err, companyProcess) {
            if (err) return res.json({
                success: false,
                message: err
            });
            if (!companyProcess) return res.json({
                success: false,
                message: "No data found to delete"
            });
            res.redirect('/companyProcess');
        });
    }
};
