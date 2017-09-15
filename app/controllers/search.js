'use strict';

const mongoose = require('mongoose');
const async = require('async');
const CompanyModel = require('../models/Company');
const Incident = require('../models/Incident');
const logger = require('log4js').getLogger('app');
const Iconv  = require('iconv-lite');

module.exports = {


    viewall: (req, res, next) => {
        Incident.find(req.body.incident, function(err, incident) {
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

    viewdetail: (req, res, next) => {
        /*
        Usermanage.findById(req.params.id, function (err, usermanage) {
            if (err) return res.json({
                success: false,
                message: err
            });
            res.render("search/viedetail");
        });
        */

        res.render("search/viewdetail");
    },
};
