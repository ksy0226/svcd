'use strict';

const mongoose = require('mongoose');
const async = require('async');

const Usermanage = require('../models/Usermanage');
const service = require('../services/usermanage');
const logger = require('log4js').getLogger('app');
const Iconv = require('iconv-lite');
const nodemailer = require('nodemailer');
const CompanyModel = require('../models/Company');

module.exports = {

    index: (req, res, next) => {
        logger.debug('req.params.searchType : ' + req.query.searchType);
        logger.debug('req.params.searchText : ' + req.query.searchText);

        var vistorCounter = null;
        var page = Math.max(1, req.params.page) > 1 ? parseInt(req.query.page) : 1;
        var limit = Math.max(1, req.params.limit) > 1 ? parseInt(req.query.limit) : 50;
        var search = service.createSearch(req);

        async.waterfall([function (callback) {
            if (search.findUser && !search.findUsermanage.$or) return callback(null, null, 0);
            logger.debug("search : " + JSON.stringify(search));
            Usermanage.count(search.findUsermanage, function (err, count) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    });
                }
                var skip = (page - 1) * limit;
                var maxPage = Math.ceil(count / limit);
                callback(null, skip, maxPage);
            });
        }, function (skip, maxPage, callback) {
            if (search.findUser && !search.findUsermanage.$or) return callback(null, [], 0);
            logger.debug("search : " + JSON.stringify(search));
            Usermanage.find(search.findUsermanage)
                .populate("_id")
                .sort('-createdAt')
                .skip(skip).limit(limit)
                .exec(function (err, usermanage) {
                    if (err) callback(err);
                    callback(null, usermanage, maxPage);
                });

        }], function (err, usermanage, maxPage) {
            if (err) {
                return res.json({
                    success: false,
                    message: err
                });
            }
            res.render("usermanage/index", {
                usermanage: usermanage,
                user: req.user,
                page: page,
                maxPage: maxPage,
                urlQuery: req._parsedUrl.query,
                search: search,
                counter: vistorCounter,
                usermanageMessage: req.flash("usermanageMessage")[0]
            });
        });
    },

    new: (req, res, next) => {
        async.waterfall([function (callback) {
            CompanyModel.find({}, function (err, company) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                }
                callback(null, company)
            });
        }], function (err, company) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }
            res.render("usermanage/new", {
                company: company
            });
        });
    },

    save: (req, res, next) => {
        logger.debug('Usermanage save debug Start >>> ', req.body.usermanage);
        var usermanage = req.body.usermanage;
        Usermanage.create(req.body.usermanage, function (err, usermanage) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
                res.redirect('/');
            }
        });
    },

    edit: (req, res, next) => {
        async.waterfall([function (callback) {
            CompanyModel.find({}, function (err, company) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                }
                callback(null, company)
            });
        }], function (err, company) {
            Usermanage.findById(req.params.id, function (err, usermanage) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                } else {
                    res.render("usermanage/edit", {
                        usermanage: usermanage,
                        user: req.user,
                        company: company
                    });
                }
            });
        });
    },

    update: (req, res, next) => {
        req.body.usermanage.updatedAt = Date.now();
        Usermanage.findOneAndUpdate({
            _id: req.params.id
        }, req.body.usermanage, function (err, usermanage) {
            if (err) return res.json({
                success: false,
                message: err
            });
            if (!usermanage) return res.json({
                success: false,
                message: "No data found to update"
            });
            res.redirect('/usermanage/');
        });
    },

    delete: (req, res, next) => {
        Usermanage.findOneAndRemove({
            _id: req.params.id
        }, function (err, usermanage) {
            if (err) return res.json({
                success: false,
                message: err
            });
            if (!usermanage) return res.json({
                success: false,
                message: "No data found to delete"
            });
            res.redirect('/usermanage');
        });
    },

    sendmail: (req, res, next) => {
        console.log('Enter sendmail!!!');
        Usermanage.find(req.body.usermanage, function (err, usermanageData) {
            if (err) return res.json({
                success: false,
                message: err
            });

            console.log(usermanageData);
            //res.json(companyJsonData);
            //res.send({usermanageData : usermanageData});

            //res.render("usermanage/index", {
            //usermanageData : usermanageData
            //});
            res.json(usermanageData);
        });

        /*
        if(req.body.email == "" || req.body.subject == "") {
            res.send("Error: Email & Subject should not blank");
            return false;
        }
        // Sending Email Without SMTP
        nodemailer.mail({
            from: "ksy0226 ✔ <ksy0226@isu.co.kr>", // sender address
            to: req.body.email, // list of receivers
            subject: req.body.subject+" ✔", // Subject line
            //text: "Hello world ✔", // plaintext body
            html: "<b>"+req.body.description+"</b>" // html body
        });
        res.send("Email has been sent successfully");
        */
    },
    /*
 
    exceldownload: (req, res, next) => {
        console.log(1);
        CompanyModel.find(req.body.company, function(err, companyJsonData) {
            if (err) return res.json({
                success: false,
                message: err
            });
            console.log(companyJsonData);
            //res.json(companyJsonData);
            //res.send({companyJsonData: companyJsonData});
            /*res.render("company/list", {
            companyJsonData: companyJsonData
        });
            res.json(companyJsonData);
        });
    }*/

    userInfo: (req, res, next) => {
        Usermanage.find({ employee_nm: { $regex: new RegExp(req.query.request_info, "i") } }, function (err, usermanageData) {
            if (err) return res.json({
                success: false,
                message: err
            });

            //console.log(usermanageData);
            //res.json(companyJsonData);
            //res.send({usermanageData : usermanageData});

            //res.render("usermanage/index", {
            //usermanageData : usermanageData
            //});
            res.json(usermanageData);
        });
    }



};
