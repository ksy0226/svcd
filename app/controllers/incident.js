'use strict';

const mongoose = require('mongoose');
const async = require('async');
const User = require('../models/User');
const Incident = require('../models/Incident');
const Counter = require('../models/Counter');
const service = require('../services/incident');
const logger = require('log4js').getLogger('app');

module.exports = {

    index: (req, res, next) => {

        logger.debug('req.params.searchType : ' + req.query.searchType);
        logger.debug('req.params.searchText : ' + req.query.searchText);

        var vistorCounter = null;
        var page = Math.max(1, req.params.page) > 1 ? parseInt(req.query.page) : 1;
        var limit = Math.max(1, req.params.limit) > 1 ? parseInt(req.query.limit) : 10;
        var search = service.createSearch(req);

        async.waterfall([function (callback) {
            if (search.findUser && !search.findIncident.$or) return callback(null, null, 0);
            logger.debug("search : " + JSON.stringify(search));
            Incident.count(search.findIncident, function (err, count) {

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
            if (search.findUser && !search.findIncident.$or) return callback(null, [], 0);
            logger.debug("search : " + JSON.stringify(search));
            Incident.find(search.findIncident)
                .populate("author")
                .sort('-createdAt')
                .skip(skip).limit(limit)
                .exec(function (err, incident) {
                    if (err) callback(err);
                    callback(null, incident, maxPage);
                });

        }], function (err, incident, maxPage) {
            if (err) {
                logger.debug('Trace8', err);
                return res.json({
                    success: false,
                    message: err
                });
            }
            //logger.debug(incident);
            res.render("incident/index", {
                incident: incident,
                user: req.user,
                page: page,
                maxPage: maxPage,
                urlQuery: req._parsedUrl.query,
                search: search,
                counter: vistorCounter,
                incidentMessage: req.flash("incidentMessage")[0]
            });
        });
    },

    new: (req, res, next) => {
        res.render("incident/new");
    },

    save: (req, res, next) => {
        async.waterfall([function (callback) {
            logger.debug('Trace777');
            Counter.findOne({
                name: "incident"
            }, function (err, counter) {
                if (err) callback(err);
                if (counter) {
                    callback(null, counter);
                } else {
                    Counter.create({
                        name: "incident",
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
            var newIncident = req.body.incident;
            logger.debug('body', req.body);
            logger.debug('newIncident', newIncident);
            logger.debug('etcInfo', req.body.etcInfo);
            //newIncident.author = req.body.etcInfo.name;
            newIncident.numId = counter.totalCount + 1;
            Incident.create(req.body.incident, function (err, incident) {
                logger.debug('err', err, '\n');
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
                res.redirect('/incident');
            });

            //res.redirect('/incident');
        });
    },

    show: (req, res, next) => {
        logger.debug("Trace11");
        Incident.findById(req.params.id).populate("author").exec(function (err, incident) {
            if (err) return res.json({
                success: false,
                message: err
            });
            incident.views++;
            //incident.save();
            //logger.debug('aaa : %s',req._parsedUrl.query);
            res.render("incident/show", {
                incident: incident,
                urlQuery: req._parsedUrl.query,
                user: req.user,
                search: service.createSearch(req)
            });
        });
    },
    edit: (req, res, next) => {
        logger.debug("Trace edit", req.params.id);
        Incident.findById(req.params.id, function (err, incident) {
            if (err) return res.json({
                success: false,
                message: err
            });
            //if (!req.user._id.equals(incident.author)) return res.json({
            //    success: false,
            //    message: "Unauthrized Attempt"
            //});
            res.render("incident/edit", {
                incident: incident,
                user: req.user
            });
        });
    },
    update: (req, res, next) => {
        logger.debug("Trace update", req.params.id);
        logger.debug(req.body);
        req.body.incident.updatedAt = Date.now();
        Incident.findOneAndUpdate({
            _id: req.params.id
            //,author: req.user._id
        }, req.body.incident, function (err, incident) {
            if (err) return res.json({
                success: false,
                message: err
            });
            if (!incident) return res.json({
                success: false,
                message: "No data found to update"
            });
            res.redirect('/incident/' + req.params.id + '/show');
        });
    },
    delete: (req, res, next) => {
        logger.debug("Trace delete", req.params.id);

        Incident.findOneAndRemove({
            _id: req.params.id
            //,author: req.user._id
        }, function (err, incident) {
            if (err) return res.json({
                success: false,
                message: err
            });
            if (!incident) return res.json({
                success: false,
                message: "No data found to delete"
            });
            res.redirect('/incident');
        });
    }
};
