'use strict';

const mongoose = require('mongoose');
const async = require('async');
const User = require('../models/User');
const Usermanage = require('../models/Usermanage');
const Counter = require('../models/Counter');
const service = require('../services/usermanage');
const logger = require('log4js').getLogger('app');
const Iconv = require('iconv-lite');
const nodemailer = require('nodemailer');

module.exports = {

    index: (req, res, next) => {
        logger.debug('req.params.searchType : ' + req.query.searchType);
        logger.debug('req.params.searchText : ' + req.query.searchText);

        var vistorCounter = null;
        var page = Math.max(1, req.params.page) > 1 ? parseInt(req.query.page) : 1;
        var limit = Math.max(1, req.params.limit) > 1 ? parseInt(req.query.limit) : 10;
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
        res.render("usermanage/new");
    },

    save: (req, res, next) => {
        async.waterfall([function (callback) {
            console.log('Trace777');
            Counter.findOne({
                name: "usermanage"
            }, function (err, counter) {
                if (err) callback(err);
                if (counter) {
                    callback(null, counter);
                } else {
                    Counter.create({
                        name: "usermanage",
                        totalCount: 0
                    }, function (err, counter) {
                        if (err) return res.json({
                            success: false,
                            message: err
                        });
                        callback(null, counter);
                    });
                }
            });
        }], function (callback, counter) {
            var newUsermanage = req.body.usermanage;
            newUsermanage.numId = counter.totalCount + 1;
            Usermanage.create(req.body.usermanage, function (err, usermanage) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                }
                counter.totalCount++;
                counter.save();
                res.redirect('/usermanage');
            });
            //res.redirect('/usermanage');
        });
    },

    /*
    show: (req, res, next) => {
        Usermanage.findById(req.params.id).populate("_id").exec(function (err, usermanage) {
            if (err) return res.json({
                success: false,
                message: err
            });
            usermanage.views++;
            res.render("usermanage/show", {
                usermanage: usermanage,
                urlQuery: req._parsedUrl.query,
                user: req.user,
                search: service.createSearch(req)
            });
        });
    },
    */

    edit: (req, res, next) => {
        Usermanage.findById(req.params.id, function (err, usermanage) {
            if (err) return res.json({
                success: false,
                message: err
            });
            res.render("usermanage/edit", {
                usermanage: usermanage,
                user: req.user
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
            res.redirect('/usermanage/' + req.params.id + '/edit');
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
        alert('Enter sendmail!!!');
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
    }
};
