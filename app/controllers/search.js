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
        /*
        var search = service.createSearch(req);
       
        async.waterfall([function (callback) {
            //console.log('search.findSearch : ' , search.findSearch);
            //console.log('datepicker_rcdValue : ', req.query.datepicker_rcd);
            //console.log('datepicker_rcd2Value : ', req.query.datepicker_rcd2);
            
            IncidentModel.find(search.findSearch, function (err, incident) {
                logger.debug('2 : ' , search.findSearch.$or);
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
            res.render("search/viewall", {
                incident: incident,
                datepicker_rcd: req.query.datepicker_rcd,
                datepicker_rcd2: req.query.datepicker_rcd2
            });
        });
        */

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
        console.log("search/list...");
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