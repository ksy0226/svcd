'use strict';

var mongoose = require('mongoose');
var async = require('async');
var Incident = require('../models/Incident');
var CompanyProcess = require('../models/CompanyProcess');
var ProcessStatus = require('../models/ProcessStatus');
var service = require('../services/incident');
var fs = require('fs');
var path = require('path');
var mailer = require('../util/nodemailer');
var CONFIG = require('../../config/config.json');
var logger = require('log4js').getLogger('app');

module.exports = {
    /** 
     * incident 조회 화면
     */
    index: (req, res, next) => {
        async.waterfall([function (callback) {
            ProcessStatus.find({}, function (err, ProcessStatus) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                }
                callback(null, ProcessStatus)
            });
        }], function (err, ProcessStatus) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
                res.render("incident/index", {
                    ProcessStatus: ProcessStatus
                });
            }
        });
    },

    /** 
     * incident 등록 화면
     */
    new: (req, res, next) => {
        async.waterfall([function (callback) {
            CompanyProcess.find({ "company_cd": req.session.company_cd }, function (err, companyProcess) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                }
                callback(null, companyProcess)
            });
        }], function (err, companyProcess) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }
            var real_contact = req.session.office_tel_no + '/';
            real_contact += req.session.hp_telno + '/';
            real_contact += req.session.email + '/';
            if (real_contact == "//") real_contact = "";

            res.render("incident/new", {
                companyProcess: companyProcess,
                user_nm: req.session.user_nm,
                sabun: req.session.sabun,
                office_tel_no: req.session.office_tel_no,
                hp_telno: req.session.hp_telno,
                real_contact: real_contact
            });
        });
    },

    /** 
     * incident 등록 화면(담당자)
     */
    new_mng: (req, res, next) => {
        res.render("incident/new_mng");
    },


    /** 
     * incident 저장
    */
    save: (req, res, next) => {

        async.waterfall([function (callback) {
            var newincident = req.body.incident;
            //TODO
            //추가수정
            newincident.request_company_cd = req.session.company_cd;
            newincident.request_company_nm = req.session.company_nm;
            newincident.request_dept_nm = req.session.dept_nm;
            newincident.request_nm = req.session.user_nm;
            newincident.request_id = req.session.user_id;

            //추가수정
            newincident.register_company_cd = req.session.company_cd;
            newincident.register_company_nm = req.session.company_nm;
            newincident.register_nm = req.session.user_nm;
            newincident.register_id = req.session.user_id;


            if (req.files) {
                newincident.attach_file = req.files;
            }
            Incident.create(newincident, function (err, newincident) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                }
                callback(null);
            });
        }], function (err) {
            logger.debug("trace 2");
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }

            ProcessStatus.find({}, function (err, ProcessStatus) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                } else {
                    res.render("incident/index", {
                        ProcessStatus: ProcessStatus
                    });
                }
            });

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
     * incident 상세 화면 조회
     */
    viewDetail: (req, res, next) => {
        logger.debug("Trace viewDetail : ", req.params.id);
        try {
            Incident.findById({
                _id: req.params.id
            }, function (err, incident) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    });
                } else {
                    //path 길이 잘라내기
                    if (incident.attach_file.length > 0) {
                        for (var i = 0; i < incident.attach_file.length; i++) {
                            var path = incident.attach_file[i].path
                            incident.attach_file[i].path = path.substring(path.indexOf(CONFIG.fileUpload.directory) + CONFIG.fileUpload.directory.length + 1);
                            if (incident.attach_file[i].mimetype != null && incident.attach_file[i].mimetype.indexOf('image') > -1) {
                                incident.attach_file[i].mimetype = 'image';
                            }
                        }
                    }
                    res.render("incident/viewDetail", {
                        incident: incident,
                        user: req.user
                    });

                    /*모달형식
                    res.send(incident);
                    */
                }
            });
        } catch (e) {
            logger.debug('incident viewDetail error : ', e);
        }
    },

    /** 
     * incident 첨부파일 다운로드
     */
    download: (req, res, next) => {
        var filepath = path.join(__dirname, '../../', CONFIG.fileUpload.directory, req.params.path1, req.params.path2);
        res.download(filepath);
    },

    /**
     * Incident 조회
     */
    getIncident: (req, res, next) => {

        var search = service.createSearch(req);
        console.log("search" + search);

        async.waterfall([function (callback) {
            //if (search.findIncident) return callback(null, []);
            Incident.find(search.findIncident, function (err, incident) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    });
                }
                callback(null, incident)
            }).sort('-created_at');
        }], function (err, incident) {
            if (err) {
                return res.json({
                    success: false,
                    message: err
                });
            }
            res.json(incident);
        });
    },

    /**
     * Incident 상세 JSON 데이타 조회
     */
    getIncidentDetail: (req, res, next) => {

        logger.debug("Trace viewDetail : ", req.params.id);
        try {
            Incident.findById({
                _id: req.params.id
            }, function (err, incident) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    });
                } else {
                    //path 길이 잘라내기
                    if (incident.attach_file.length > 0) {
                        for (var i = 0; i < incident.attach_file.length; i++) {
                            var path = incident.attach_file[i].path
                            incident.attach_file[i].path = path.substring(path.indexOf(CONFIG.fileUpload.directory) + CONFIG.fileUpload.directory.length + 1);
                            if (incident.attach_file[i].mimetype != null && incident.attach_file[i].mimetype.indexOf('image') > -1) {
                                incident.attach_file[i].mimetype = 'image';
                            }
                        }
                    }
                    res.send(incident);
                }
            });
        } catch (e) {
            logger.debug('****************', e);
        }
    },



    /**
     * summernote 이미지링크 처리
     */
    insertedImage: (req, res, next) => {
        //res.send( '/uploads/' + req.file.filename);
        logger.debug("=====================>incident controllers insertedImage");
        res.send(req.file.filename);
    },

    /**
     * 서비스 평가 내용 등록
     */
    valuationSave: (req, res, next) => {
        logger.debug("valuationSave =====================> " + JSON.stringify(req.body));
        logger.debug("req.body.incident : ", req.body.incident);
        try {
            async.waterfall([function (callback) {
                var upIncident = req.body.incident;
                upIncident.status_cd = '4';
                upIncident.status_nm = '완료';
                callback(null, upIncident);
            }], function (err, upIncident) {
                logger.debug("=========> upIncident ", upIncident);

                if (err) {
                    res.json({
                        success: false,
                        message: "No data found to update"
                    });
                } else {
                    Incident.findOneAndUpdate({
                        _id: req.params.id
                    }, upIncident, function (err, Incident) {
                        if (err) return res.json({
                            success: false,
                            message: err
                        });
                        if (!Incident) {
                            return res.json({
                                success: false,
                                message: "No data found to update"
                            });
                        } else {
                            //완료 업데이트 성공 시 메일 전송
                            mailer.finalSend(Incident);

                            return res.json({
                                success: true,
                                message: "update successed"
                            });
                        }
                    });
                }
            });
        } catch (e) {
            logger.error("incident control valuationSave : ", e);
            return res.json({
                success: false,
                message: err
            });
        }
    },
    /**
     * 엑셀다운로드 기능
     */
    exceldownload: (req, res, next) => {
        logger.debug("====>",1);
        
        Incident.find(req.body.incident)
                .select('_id title')
                .exec(function(err, incidentJsonData) {
                    if (err){
                        console.log("excel 2>>>>>>>>>>>>>>>", err);
                        return res.json({
                            success: false,
                            message: err
                        });
                    }
                    console.log("excel 2>>>>>>>>>>>>>>>",incidentJsonData);
        
                res.json(incidentJsonData);
        });
       /*
        Incident.find(req.body.incident, function(err, incidentJsonData) {
            if (err) return res.json({
                success: false,
                message: err
            });
            logger.debug(incidentJsonData);
            
            res.json(incidentJsonData);
        });
       */
    }
};