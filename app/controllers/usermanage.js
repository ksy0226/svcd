'use strict';

const mongoose = require('mongoose');
const async = require('async');
const User = require('../models/User');
const Usermanage = require('../models/Usermanage');
const Counter = require('../models/Counter');
const service = require('../services/usermanage');
const logger = require('log4js').getLogger('app');
const Iconv = require('iconv-lite');

module.exports = {

    usermanageIndex: (req, res, next) => {

        logger.debug('req.params.searchType : ' + req.query.searchType);
        logger.debug('req.params.searchText : ' + req.query.searchText);

        //logger.debug('req.params.searchText : ' + Iconv.decode(req.query.searchText, 'UTF-8'));


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
                /*
                res.render("http/500", {
                    err: err
                });
                */
                var skip = (page - 1) * limit;
                var maxPage = Math.ceil(count / limit);
                callback(null, skip, maxPage);
            });
        }, function (skip, maxPage, callback) {
            if (search.findUser && !search.findUsermanage.$or) return callback(null, [], 0);
            logger.debug("search : " + JSON.stringify(search));
            Usermanage.find(search.findUsermanage)
                .populate("author")
                .sort('-createdAt')
                .skip(skip).limit(limit)
                .exec(function (err, usermanage) {
                    if (err) callback(err);
                    callback(null, usermanage, maxPage);
                });

        }], function (err, usermanage, maxPage) {
            if (err) {
                console.log('Trace8', err);
                return res.json({
                    success: false,
                    message: err
                });
            }
            //logger.debug(usermanage);
            res.render("usermanage/usermanageIndex", {
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

    usermanageNew: (req, res, next) => {
        res.render("usermanage/usermanageNew");
    },

    usermanageSave: (req, res, next) => {
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
            console.log('body', req.body);
            console.log('newUsermanage', newUsermanage);
            console.log('etcInfo', req.body.etcInfo);
            //newUsermanage.author = req.body.etcInfo.name;
            newUsermanage.numId = counter.totalCount + 1;
            Usermanage.create(req.body.usermanage, function (err, usermanage) {
                console.log('err', err, '\n');
                /*
                if (err) return res.json({
                    success: false,
                    message: err
                });
                */
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

    usermanageShow: (req, res, next) => {
        console.log("Trace11");
        Usermanage.findById(req.params.id).populate("author").exec(function (err, usermanage) {
            if (err) return res.json({
                success: false,
                message: err
            });
            usermanage.views++;
            //usermanage.save();
            //console.log('aaa : %s',req._parsedUrl.query);
            res.render("usermanage/usermanageShow", {
                usermanage: usermanage,
                urlQuery: req._parsedUrl.query,
                user: req.user,
                search: service.createSearch(req)
            });
        });
    },
    usermanageEdit: (req, res, next) => {
        console.log("Trace edit", req.params.id);
        Usermanage.findById(req.params.id, function (err, usermanage) {
            if (err) return res.json({
                success: false,
                message: err
            });
            //if (!req.user._id.equals(usermanage.author)) return res.json({
            //    success: false,
            //    message: "Unauthrized Attempt"
            //});
            res.render("usermanage/usermanageEdit", {
                usermanage: usermanage,
                user: req.user
            });
        });
    },
    usermanageUpdate: (req, res, next) => {
        console.log("Trace update", req.params.id);
        console.log(req.body);
        req.body.usermanage.updatedAt = Date.now();
        Usermanage.findOneAndUpdate({
            _id: req.params.id
            //,author: req.user._id
        }, req.body.usermanage, function (err, usermanage) {
            if (err) return res.json({
                success: false,
                message: err
            });
            if (!usermanage) return res.json({
                success: false,
                message: "No data found to update"
            });
            res.redirect('/usermanage/' + req.params.id + '/usermanageShow');
        });
    },
    usermanageDelete: (req, res, next) => {
        console.log("Trace delete", req.params.id);

        Usermanage.findOneAndRemove({
            _id: req.params.id
            //,author: req.user._id
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
    }

};
