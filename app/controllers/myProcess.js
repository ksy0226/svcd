'use strict';

const mongoose = require('mongoose');
const async = require('async');
const MyProcessModel = require('../models/MyProcess');
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
            MyProcessModel.find(req.body.myProcess, function (err, company) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                }
                callback(null, higherprocess, company)
            });
        }], function (err, higherprocess, company) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
                res.render("myProcess/index", {
                    higherprocess: higherprocess,
                    company : company
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
                res.render("myProcess/new", {
                    higher: higher,
                    company : company
                });
            }
        });
    },

    save: (req, res, next) => {
        var myProcess = req.body.myProcess;
        MyProcessModel.create(req.body.myProcess, function (err, myProcess) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
                res.redirect('/myProcess');
            }
        });
    },

    edit: (req, res, next) => {
        MyProcessModel.findById(req.params.id, function (err, myProcess) {
            if (err) return res.json({
                success: false,
                message: err
            });
            res.render("myProcess/edit", {
                myProcess: myProcess
            });
        });
    },

    update: (req, res, next) => {
        MyProcessModel.findOneAndUpdate({
            _id: req.params.id
        }, req.body.myProcess, function (err, myProcess) {
            if (err) return res.json({
                success: false,
                message: err
            });
            if (!myProcess) return res.json({
                success: false,
                message: "No data found to update"
            });
            res.redirect('/myProcess/edit/' + req.params.id);
        });
    },

    delete: (req, res, next) => {
        MyProcessModel.findOneAndRemove({
            _id: req.params.id
        }, function (err, myProcess) {
            if (err) return res.json({
                success: false,
                message: err
            });
            if (!myProcess) return res.json({
                success: false,
                message: "No data found to delete"
            });
            res.redirect('/myProcess');
        });
    }
};
