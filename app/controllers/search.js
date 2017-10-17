'use strict';

const mongoose = require('mongoose');
const async = require('async');
const CompanyModel = require('../models/Company');
const IncidentModel = require('../models/Incident');
const HigherProcessModel = require('../models/HigherProcess');
const LowerProcessModel = require('../models/LowerProcess');
const OftenQnaModel = require('../models/OftenQna');
const service = require('../services/incident');
const service2 = require('../services/oftenqna');
const logger = require('log4js').getLogger('app');
const Iconv  = require('iconv-lite');

module.exports = {

    /**
     * 사용자별 리스트 > 상위업무 가져오기
     */
    user_list: (req, res, next) => {
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
                res.render("search/user_list", {
                    higherprocess: higherprocess
                });
            }
        });
    },

    /**
     * 사용자별 상세조회 > Incident 가져오기
     */
    user_detail: (req, res, next) => {
        logger.debug("Trace user_detail : ", req.params.id);
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
                /*
                //path 길이 잘라내기
                if (incident.attach_file.length > 0) {
                    for (var i = 0; i < incident.attach_file.length; i++) {
                        var path = incident.attach_file[i].path
                        incident.attach_file[i].path = path.substring(path.indexOf(CONFIG.fileUpload.directory) + CONFIG.fileUpload.directory.length + 1);
                        if (incident.attach_file[i].mimetype.indexOf('image') > -1) {
                            incident.attach_file[i].mimetype = 'image';
                        }
                    }
                }
                
                */

                //완료요청일, 등록일, 접수일, 완료예정일, 완료일
                incident.request_complete_date = new Date(incident.request_complete_date).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                incident.register_date = new Date(incident.register_date).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                incident.receipt_date = new Date(incident.receipt_date).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                incident.complete_reserve_date = new Date(incident.complete_reserve_date).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                incident.complete_date = new Date(incident.complete_date).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                
                
                res.render("search/user_detail", {
                    incident: incident
                });
            }
        });
    },
    
    /**
     * 사용자별 상세조회 > Incident 가져오기
     */
    user_detail: (req, res, next) => {
        logger.debug("Trace user_detail : ", req.params.id);
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
                /*
                //path 길이 잘라내기
                if (incident.attach_file.length > 0) {
                    for (var i = 0; i < incident.attach_file.length; i++) {
                        var path = incident.attach_file[i].path
                        incident.attach_file[i].path = path.substring(path.indexOf(CONFIG.fileUpload.directory) + CONFIG.fileUpload.directory.length + 1);
                        if (incident.attach_file[i].mimetype.indexOf('image') > -1) {
                            incident.attach_file[i].mimetype = 'image';
                        }
                    }
                }
                
                */

                //완료요청일, 등록일, 접수일, 완료예정일, 완료일
                incident.request_complete_date = new Date(incident.request_complete_date).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                incident.register_date = new Date(incident.register_date).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                incident.receipt_date = new Date(incident.receipt_date).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                incident.complete_reserve_date = new Date(incident.complete_reserve_date).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                incident.complete_date = new Date(incident.complete_date).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                
                
                res.render("search/user_detail", {
                    incident: incident
                });
            }
        });
    },

    /**
     * 사용자 자주묻는 질문과 답
     */
    user_qna: (req, res, next) => {
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
                res.render("search/user_qna", {
                    higherprocess: higherprocess
                });
            }
        });
    },

    /**
     * 자주묻는 질문과 답 상세조회 > OfteQna 가져오기
     */
    qna_detail: (req, res, next) => {
        
        logger.debug("Trace user_detail : ", req.params.id);
        console.log("Trace user_detail : ", req.params.id);
        
        OftenQnaModel.findById({
            _id: req.params.id
        }, function (err, oftenqna) {
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
                /*
                //path 길이 잘라내기
                if (incident.attach_file.length > 0) {
                    for (var i = 0; i < incident.attach_file.length; i++) {
                        var path = incident.attach_file[i].path
                        incident.attach_file[i].path = path.substring(path.indexOf(CONFIG.fileUpload.directory) + CONFIG.fileUpload.directory.length + 1);
                        if (incident.attach_file[i].mimetype.indexOf('image') > -1) {
                            incident.attach_file[i].mimetype = 'image';
                        }
                    }
                }
                
                */

                //완료요청일, 등록일, 접수일, 완료예정일, 완료일
                /*
                incident.request_complete_date = new Date(incident.request_complete_date).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                incident.register_date = new Date(incident.register_date).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                incident.receipt_date = new Date(incident.receipt_date).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                incident.complete_reserve_date = new Date(incident.complete_reserve_date).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                incident.complete_date = new Date(incident.complete_date).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                */
                
                res.render("search/qna_detail", {
                    oftenqna: oftenqna
                });
            }
        });
    },

    /**
     * 전체 조회(관리자용)
     */
    mng_list: (req, res, next) => {
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
                res.render("search/mng_list", {
                    higherprocess: higherprocess
                });
            }
        });
    },
    /**
     * 사용자별 상세조회 > Incident 가져오기
     */
    mng_detail: (req, res, next) => {
        logger.debug("Trace mng_detail : ", req.params.id);
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
                /*
                //path 길이 잘라내기
                if (incident.attach_file.length > 0) {
                    for (var i = 0; i < incident.attach_file.length; i++) {
                        var path = incident.attach_file[i].path
                        incident.attach_file[i].path = path.substring(path.indexOf(CONFIG.fileUpload.directory) + CONFIG.fileUpload.directory.length + 1);
                        if (incident.attach_file[i].mimetype.indexOf('image') > -1) {
                            incident.attach_file[i].mimetype = 'image';
                        }
                    }
                }
                
                */

                //완료요청일, 등록일, 접수일, 완료예정일, 완료일
                incident.request_complete_date = new Date(incident.request_complete_date).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                incident.register_date = new Date(incident.register_date).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                incident.receipt_date = new Date(incident.receipt_date).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                incident.complete_reserve_date = new Date(incident.complete_reserve_date).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                incident.complete_date = new Date(incident.complete_date).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                
                
                res.render("search/mng_detail", {
                    incident: incident
                });
            }
        });
    },

    /**
     * 연도별 미처리 리스트
     */
    remain_list : (req, res, next) => {
        IncidentModel.find(req.body.incident, function(err, incident) {
            //logger.debug('err', err, '\n');
            logger.debug('list 호출');
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }
            res.render("search/remain_list", {
                incident: incident
            });
        });
    },

    /**
     * 진행 상태별 인시던트 조회
     */
    status_list : (req, res, next) => {
        
        IncidentModel.find(req.body.incident, function(err, incident) {
            //logger.debug('err', err, '\n');
            logger.debug('list 호출');
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }
            res.render("search/status_list", {
                incident: incident
            });
        });
    },

    /**
     * 하위업무 리스트 조회
     */
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

    /**
     * user_list 데이터 조회
     */
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
    },
    /**
     * user_qna 데이터 조회
     */
    getqnalist : (req, res, next) => {
        var search2 = service2.createSearch(req);

        logger.debug("=====================> " + JSON.stringify(search2));
        //console.log("search"+ JSON.stringify(search));

        try {
            async.waterfall([function (callback) {
                OftenQnaModel.find(search2.findOftenqna, function (err, oftenqna) {
                    if (err) {
                        res.render("http/500", {
                            err: err
                        });
                    } else {
                        callback(null, oftenqna)
                    }
                }).sort("-" + search2.order_by);
            }], function (err, oftenqna) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                } else {
                    res.send(oftenqna);
                }
            });
        } catch (e) {
            logger.debug('oftenqna controllers error ====================> ', e)
        }
    }

};