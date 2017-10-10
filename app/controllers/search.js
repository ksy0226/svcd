'use strict';

const mongoose = require('mongoose');
const async = require('async');
const CompanyModel = require('../models/Company');
const IncidentModel = require('../models/Incident');
const HigherProcessModel = require('../models/HigherProcess');
const LowerProcessModel = require('../models/LowerProcess');
var service = require('../services/search');
const logger = require('log4js').getLogger('app');
const Iconv  = require('iconv-lite');

module.exports = {


    viewall: (req, res, next) => {
        async.waterfall([function (callback) {
            HigherProcessModel.find({},function (err, higherprocess) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                }
                callback(null, higherprocess)
            });
        }], function (err, higherprocess) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }else{
                res.render("search/viewall", {
                    higherprocess: higherprocess
                });
            }
        });
    },

    qna: (req, res, next) => {
        /*
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
        }).sort('-created_at');
        */

        async.waterfall([function (callback) {
            HigherProcessModel.find({},function (err, higherprocess) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                }
                callback(null, higherprocess)
            });
        }], function (err, higherprocess) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }else{
                res.render("search/qna", {
                    higherprocess: higherprocess
                });
            }
        });      
    },

    viewdetail: (req, res, next) => {

        logger.debug("Trace viewDetail : ", req.params.id);
        IncidentModel.findById({
            _id: req.params.id
        }, function (err, incident) {
            if (err) {
                return res.json({
                    success: false,
                    message: err
                });
            } else {
                /*
                logger.debug(">>> incident : ", incident.attach_file);
                //path 길이 잘라내기
                if (incident.attach_file.length > 0) {
                    for (var i = 0; i < incident.attach_file.length; i++) {
                        var path = incident.attach_file[i].path
                        incident.attach_file[i].path = path.substring(path.indexOf(CONFIG.fileUpload.directory) + CONFIG.fileUpload.directory.length + 1);
                        logger.debug("==========> incident.attach_file[i].mimetype.indexOf('image') ",incident.attach_file[i].mimetype.indexOf('image'));
                        if(incident.attach_file[i].mimetype.indexOf('image')>-1){
                            incident.attach_file[i].mimetype = 'image';
                        }
                    }
                }
                logger.debug("*** incident : ", incident.attach_file);
                */

                res.render("search/viewdetail", {
                    incident: incident
                });
            }
        });
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
    },

    
    getlowerprocess :  (req, res, next) => {   
        logger.debug(1);
        LowerProcessModel.find(req.body.lowerprocess, function(err, lowerprocess) {
            logger.debug('lowerprocess.lower_nm',req.body.lowerprocess);
            if (err) return res.json({
                success: false,
                message: err
            });
            res.json(lowerprocess);
        });
    },


    list: (req, res, next) => {
        var search = service.createSearch(req);

        async.waterfall([function (callback) {
            IncidentModel.find(search.findIncident, function (err, incident) {
                
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                }
                callback(null, incident)
            });
        }], function (err, incident) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }
            res.send(incident);
        });
    }

};