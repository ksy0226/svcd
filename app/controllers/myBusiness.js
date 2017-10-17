'use strict';

const mongoose = require('mongoose');
const async = require('async');
const MyBusinessModel = require('../models/MyBusiness');
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
            MyBusinessModel.find(req.body.myBusiness, function (err, company) {
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
                res.render("myBusiness/index", {
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
                res.render("myBusiness/new", {
                    higher: higher,
                    company : company
                });
            }
        });
    },

    save: (req, res, next) => {
        var myBusiness = req.body.myBusiness;
        MyBusinessModel.create(req.body.myBusiness, function (err, myBusiness) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
                res.redirect('/myBusiness');
            }
        });
    },

    edit: (req, res, next) => {
        MyBusinessModel.findById(req.params.id, function (err, myBusiness) {
            if (err) return res.json({
                success: false,
                message: err
            });
            res.render("myBusiness/edit", {
                myBusiness: myBusiness
            });
        });
    },

    update: (req, res, next) => {
        MyBusinessModel.findOneAndUpdate({
            _id: req.params.id
        }, req.body.myBusiness, function (err, myBusiness) {
            if (err) return res.json({
                success: false,
                message: err
            });
            if (!myBusiness) return res.json({
                success: false,
                message: "No data found to update"
            });
            res.redirect('/myBusiness/edit/' + req.params.id);
        });
    },

    delete: (req, res, next) => {
        MyBusinessModel.findOneAndRemove({
            _id: req.params.id
        }, function (err, myBusiness) {
            if (err) return res.json({
                success: false,
                message: err
            });
            if (!myBusiness) return res.json({
                success: false,
                message: "No data found to delete"
            });
            res.redirect('/myBusiness');
        });
    }
};