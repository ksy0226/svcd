'use strict';

const mongoose = require('mongoose');
const async = require('async');
const Incident = require('../models/Incident');
const ProcessStatus = require('../models/ProcessStatus');
const ProcessGubun = require('../models/ProcessGubun');
const LowerProcess = require('../models/LowerProcess');
const service = require('../services/incident');
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
     * 인시던트 관리자용 상세 조회 화면
     */
    work_detail: (req, res, next) => {
        console.log(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') );
        try{
            async.waterfall([function (callback) {
                Incident.findById({
                    _id: req.params.id
                }, function (err, incident) {
                    if (err) {
                        return res.json({
                            success: false,
                            message: err
                        });
                    } else {
                        //완료요청일, 등록일, 접수일, 완료예정일, 완료일
                        if(incident.request_complete_date != '') incident.request_complete_date = incident.request_complete_date.substring(0,10);
                        if(incident.register_date != '') incident.register_date = incident.register_date.substring(0,10);
                        if(incident.receipt_date != '') incident.receipt_date = incident.receipt_date.substring(0,10);
                        if(incident.complete_reserve_date != '') incident.complete_reserve_date = incident.complete_reserve_date.substring(0,10);
                        if(incident.complete_date != '') incident.complete_date = incident.complete_date.substring(0,10);
                        //incident.complete_date = new Date(incident.complete_date).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                        
                        callback(null,incident)
                    }
                });

            }, function (incident, callback) {
                LowerProcess.find({"higher_cd":incident.higher_cd}).sort('lower_nm').exec(function (err, lowerprocess) {
                    if (err) {
                        res.render("http/500", {
                            err: err
                        });
                    }
                    callback(null, incident, lowerprocess)
                });
            }], function (err, incident, lowerprocess) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                }else{
                    res.render("manager/work_detail", {
                        incident: incident,
                        lowerprocess: lowerprocess
                    });
                }
            });

        }catch(e){
            logger.error("manager control work_detail : ",e);
        }
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
        }).sort('-created_at');
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
     * 접수내용 등록
     */
    saveReceipt : (req, res, next) => {
        logger.debug("saveReceipt =====================> " + JSON.stringify(req.body));
        logger.debug("req.body.incident : ",req.body.incident);

        try{
            async.waterfall([function (callback) {
                
                var upIncident = req.body.incident;
                var dt = new Date();
                logger.debug("=========>1 ",dt.getFullYear()+"-"+(dt.getMonth()+1)+"-"+dt.getDate()+" "+dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds());
                logger.debug("=========>2 ",new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''));

                upIncident.receipt_date = dt.getFullYear()+"-"+(dt.getMonth()+1)+"-"+dt.getDate()+" "+dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds();
                
                //upIncident.receipt_date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                upIncident.status_cd = '2';
                upIncident.status_nm = '처리중';
                callback(null,upIncident);

            }], function (err, upIncident) {
                if (err) {
                    res.json({
                        success: false,
                        message: "No data found to update"
                    });
                }else{
                    Incident.findOneAndUpdate({
                        _id: req.params.id
                    }, upIncident, function (err, Incident) {
                        if (err) return res.json({
                            success: false,
                            message: err
                        });
                        if (!Incident){ 
                            return res.json({
                                    success: false,
                                    message: "No data found to update"
                            });
                        }else{
                            //접수 업데이트 성공 시
                            logger.debug("=====================================================================================");
                            logger.debug("=========== 메일발송 대상인지 체크 후 처리로직 추가구현(TODO mailLogic )  ==============");
                            logger.debug("=====================================================================================");
                            
                            
                            return res.json({
                                success: true,
                                message: "update successed"
                            });
                        }
                    });
                }
            });

        }catch(e){
            logger.error("manager control saveReceipt : ",e);
            return res.json({
                success: false,
                message: err
            });
        }
        
    },
    
    /**
     * 완료내용 등록
     */
    saveComplete : (req, res, next) => {
        logger.debug("saveComplete =====================> " + JSON.stringify(req.body));
        logger.debug("req.body.incident : ",req.body.incident);

        try{
            async.waterfall([function (callback) {
                
                var upIncident = req.body.incident;
                var dt = new Date();
                logger.debug("=========>1 ",dt.getFullYear()+"-"+(dt.getMonth()+1)+"-"+dt.getDate()+" "+dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds());
                logger.debug("=========>2 ",new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''));

                upIncident.complete_date = dt.getFullYear()+"-"+(dt.getMonth()+1)+"-"+dt.getDate()+" "+dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds();
                
                //upIncident.receipt_date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                upIncident.status_cd = '3';
                upIncident.status_nm = '미평가';
                callback(null,upIncident);

            }], function (err, upIncident) {
                logger.debug("=========> upIncident ",upIncident);

                if (err) {
                    res.json({
                        success: false,
                        message: "No data found to update"
                    });
                }else{
                    Incident.findOneAndUpdate({
                        _id: req.params.id
                    }, upIncident, function (err, Incident) {
                        if (err) return res.json({
                            success: false,
                            message: err
                        });
                        if (!Incident){ 
                            return res.json({
                                    success: false,
                                    message: "No data found to update"
                            });
                        }else{
                            //완료 업데이트 성공 시
                            logger.debug("=====================================================================================");
                            logger.debug("=========== 메일발송 대상인지 체크 후 처리로직 추가구현(TODO mailLogic )  ==============");
                            logger.debug("=====================================================================================");
                            
                            
                            return res.json({
                                success: true,
                                message: "update successed"
                            });
                        }
                    });
                }
            });

        }catch(e){
            logger.error("manager control saveComplete : ",e);
            return res.json({
                success: false,
                message: err
            });
        }
        
    },

};
