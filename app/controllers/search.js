'use strict';

const mongoose = require('mongoose');
const async = require('async');
const CompanyModel = require('../models/Company');
const IncidentModel = require('../models/Incident');
const logger = require('log4js').getLogger('app');
const Iconv  = require('iconv-lite');

module.exports = {


    viewall: (req, res, next) => {
        IncidentModel.find(req.body.incident, function(err, incident) {
            //logger.debug('err', err, '\n');
            logger.debug('list 호출');
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }
            res.render("search/viewall", {
                incident: incident
            });
        }).sort('-createdAt');
    },

    qna: (req, res, next) => {
        IncidentModel.find(req.body.incident, function(err, incident) {
            //logger.debug('err', err, '\n');
            logger.debug('list 호출');
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }
            res.render("search/qna", {
                incident: incident
            });
        }).sort('-createdAt');
    },

    viewdetail: (req, res, next) => {

    },

    searchall: (req, res, next) => {
        IncidentModel.find(req.body.incident, function(err, incident) {
            //logger.debug('err', err, '\n');
            logger.debug('list 호출');
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }
            res.render("search/searchall", {
                incident: incident
            });
        }).sort('-createdAt');
    },

    comhigherstatistic : (req, res, next) => {
        IncidentModel.find(req.body.incident, function(err, incident) {
            //logger.debug('err', err, '\n');
            logger.debug('list 호출');
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }
            res.render("search/comhigherstatistic", {
                incident: incident
            });
        });
    },

    highlowerstatistic : (req, res, next) => {
        IncidentModel.find(req.body.incident, function(err, incident) {
            //logger.debug('err', err, '\n');
            logger.debug('list 호출');
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }
            res.render("search/highlowerstatistic", {
                incident: incident
            });
        });
    },

    remainlist : (req, res, next) => {
        IncidentModel.find(req.body.incident, function(err, incident) {
            //logger.debug('err', err, '\n');
            logger.debug('list 호출');
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }
            res.render("search/remainlist", {
                incident: incident
            });
        });
    },

    managermonthlist : (req, res, next) => {
        IncidentModel.find(req.body.incident, function(err, incident) {
            //logger.debug('err', err, '\n');
            logger.debug('list 호출');
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }
            res.render("search/managermonthlist", {
                incident: incident
            });
        });
    },

    gubunlist : (req, res, next) => {
        IncidentModel.find(req.body.incident, function(err, incident) {
            //logger.debug('err', err, '\n');
            logger.debug('list 호출');
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }
            res.render("search/gubunlist", {
                incident: incident
            });
        });
    }
};
