'use strict';

var mongoose = require('mongoose');
var async = require('async');
var Incident = require('../models/Incident');
var CompanyProcess = require('../models/CompanyProcess');
var ManagerTask = require('../models/ManagerTask');
var service = require('../services/incident');
var fs = require('fs');
var path = require('path');
var logger = require('log4js').getLogger('app');

module.exports = {
    /** 
     * incident 조회 화면
     */

    index: (req, res, next) => {
        /*
        async.waterfall([function (callback) {
            CompanyProcess.find({"company_cd":req.session.company_cd},function(err, companyProcess) {
                logger.debug('CompanyProcess.find');
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                }
                logger.debug('companyProcess1 : ', companyProcess);
                callback(null, companyProcess)
            });
        }, function (err, companyProcess) {
            logger.debug("companyProcess :::" + companyProcess);
            Incident.find({}, function(err, incident) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                }    
                callback(null, incident)
            });

        }], function (err, incident) {
            logger.debug("incident :::" + incident);
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }
            res.render("question/index", {
                incident: incident
            });
        });*/
        /*
        async.waterfall([function (callback) {
            Incident.find({}, function (err, incident) {
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
            res.render("incident/", {
                incident: incident
            });
        });
        */


        Incident.find({}, function(err, incident) {
            //logger.debug('err', err, '\n');
            logger.debug('list 호출');
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }
            res.render("incident/index", {
                incident: incident
            });
        }).sort('-register_date');

    },

    /** 
     * incident 등록 화면
     */
    new: (req, res, next) => {

        async.waterfall([function (callback) {
            CompanyProcess.find({"company_cd":req.session.company_cd},function(err, companyProcess) {
                logger.debug('CompanyProcess.find');
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                }
                logger.debug('companyProcess1 : ', companyProcess);
                callback(null, companyProcess)
            });
        }], function (err, companyProcess) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }
            logger.debug('companyProcess2 : ', companyProcess);
            res.render("incident/new", {
                companyProcess: companyProcess
            });
        });
    },

    /** 
     * incident 저장
    */
    save: (req, res, next) => {
        var newincident = req.body.incident;
        if(req.files){
            newincident.attach_file = req.files;
        }
        logger.debug("newincident = ",newincident);
        ManagerTask.create({"com_cd":"SAP","higher_cd":"접수대기","lower_cd":"접수대기"}, function(err, incident) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }else{
                res.render("incident", {
                    incident: newincident
                });                
            }
        });
        Incident.create(newincident, function(err, incident) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }else{
                res.render("incident", {
                    incident: newincident
                });                
            }
        });
    },

    /** 
     * incident 상세 화면
     */
    show: (req, res, next) => {
        res.render("incident/show", {
            incident: incident,
            urlQuery: req._parsedUrl.query,
            user: req.user,
            search: service.createSearch(req)
        });
    },

    /** 
     * incident 수정 화면
     */
    edit: (req, res, next) => {
        res.render("incident/edit", {
            incident: incident,
            user: req.user
        });
    },

    /** 
     * incident 수정 등록
     */
    update: (req, res, next) => {
        res.redirect('/incident/' + req.params.id + '/show');
    },

    /**
     * incident 삭제 
     */
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
    },
    /** 
     * incident 등록 화면
     */
    viewDetail: (req, res, next) => {
        res.render("incident/viewDetail");
    },
};