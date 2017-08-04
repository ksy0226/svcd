'use strict';

const mongoose = require('mongoose');
const async = require('async');
const Incident = require('../models/Incident');
const Counter = require('../models/Counter');
const service = require('../services/incident');

const logger = require('log4js').getLogger('app');

module.exports = {

    index: (req, res, next) => {


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
    },

    new: (req, res, next) => {
        res.render("incident/new");
    },

    save: (req, res, next) => {
        logger.debug('====> Incident save......');
        

        
        var newincident = req.body.incident;
        logger.debug('====> Incident save......',req.body);
        Incident.create(newincident, function(err, incident) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }else{
                if(req.file){
                    logger.debug('====> req.file');
                    fs.rename( req.file.path , uploadDir +'/' + req.file.filename , function (err){ 
                        res.render("incident", {
                            incident: incident
                        });
                    });
                }else{
                    logger.debug('====> req.file not');
                    res.render("incident", {
                            incident: incident
                        });
                }
            }
        });

    },

    show: (req, res, next) => {

        res.render("incident/show", {
            incident: incident,
            urlQuery: req._parsedUrl.query,
            user: req.user,
            search: service.createSearch(req)
        });

    },
    edit: (req, res, next) => {

        res.render("incident/edit", {
            incident: incident,
            user: req.user
        });

    },
    update: (req, res, next) => {

        res.redirect('/incident/' + req.params.id + '/show');

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