'use strict';

const mongoose = require('mongoose');
const async = require('async');
const Incident = require('../models/Incident');
const ProcessStatus = require('../models/ProcessStatus');
const LowerProcess = require('../models/LowerProcess');
const service = require('../services/manager');
const logger = require('log4js').getLogger('app');
const Iconv  = require('iconv-lite');

module.exports = {

    /**
     * 인시던트 관리자용 조회 화면
     */
    work_list: (req, res, next) => {

        async.waterfall([function (callback) {
            ProcessStatus.find({}, function (err, status) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                }
                callback(null, status);
            });
        }, function (status, callback) {
            LowerProcess.find().sort('higher_cd').sort('lower_nm').exec(function (err, lowerprocess) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                }
                callback(null, status, lowerprocess)
            });
        }], function (err, status, lowerprocess) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }else{
                res.render("manager/work_list", {
                    status: status,
                    lowerprocess: lowerprocess
                });
            }
        });
    },

    /**
     * 담당자별 업무 지정
     */
    work_assign: (req, res, next) => {
        Incident.find(req.body.incident, function(err, incident) {
            //logger.debug('err', err, '\n');
            logger.debug('list 호출');
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }
            res.render("manager/work_assign", {
                incident: incident
            });
        }).sort('-createdAt');
    },

    /**
     * 담당자 월별 처리 내역
     */
    month_list: (req, res, next) => {
        Incident.find(req.body.incident, function(err, incident) {
            //logger.debug('err', err, '\n');
            logger.debug('list 호출');
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }
            res.render("manager/month_list", {
                incident: incident
            });
        }).sort('-createdAt');
    },

    /**
     * 회사별 상위업무 지정
     */
    com_process : (req, res, next) => {
        Incident.find(req.body.incident, function(err, incident) {
            //logger.debug('err', err, '\n');
            logger.debug('list 호출');
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }
            res.render("manager/com_process", {
                incident: incident
            });
        }).sort('-createdAt');
    },
    
    /**
     * 인시던트 데이타 조회
     */
    getIncident: (req, res, next) => {
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
