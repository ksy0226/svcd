'use strict';

const mongoose = require('mongoose');
const async = require('async');
const CompanyBusinessModel = require('../models/CompanyBusiness');
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
            CompanyBusinessModel.find(req.body.companyBusiness, function (err, companyBusiness) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                }
                callback(null, higherprocess, company, companyBusiness)
            });
        }], function (err, higherprocess, company, companyBusiness) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
                res.render("companyBusiness/index", {
                    higherprocess: higherprocess,
                    company: company,
                    companyBusiness: companyBusiness
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
                res.render("companyBusiness/new", {
                    higher: higher,
                    company: company
                });
            }
        });
    },

    save: (req, res, next) => {
        var companyBusiness = req.body.companyBusiness;
        CompanyBusinessModel.create(req.body.companyBusiness, function (err, companyBusiness) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
                res.redirect('/companyBusiness');
            }
        });
    },

    edit: (req, res, next) => {
        CompanyBusinessModel.findById(req.params.id, function (err, companyBusiness) {
            if (err) return res.json({
                success: false,
                message: err
            });
            res.render("companyBusiness/edit", {
                companyBusiness: companyBusiness
            });
        });
    },

    update: (req, res, next) => {
        CompanyBusinessModel.findOneAndUpdate({
            _id: req.params.id
        }, req.body.companyBusiness, function (err, companyBusiness) {
            if (err) return res.json({
                success: false,
                message: err
            });
            if (!companyBusiness) return res.json({
                success: false,
                message: "No data found to update"
            });
            res.redirect('/companyBusiness/edit/' + req.params.id);
        });
    },

    delete: (req, res, next) => {
        CompanyBusinessModel.findOneAndRemove({
            _id: req.params.id
        }, function (err, companyBusiness) {
            if (err) return res.json({
                success: false,
                message: err
            });
            if (!companyBusiness) return res.json({
                success: false,
                message: "No data found to delete"
            });
            res.redirect('/companyBusiness');
        });
    }
};
