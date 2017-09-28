'use strict';

var mongoose = require('mongoose');
var async = require('async');
var Incident = require('../models/Incident');
var CompanyProcess = require('../models/CompanyProcess');
var ProcessStatus = require('../models/ProcessStatus');
var service = require('../services/incident');
var fs = require('fs');
var path = require('path');
var CONFIG = require('../../config/config.json');
var logger = require('log4js').getLogger('app');

module.exports = {
    /** 
     * incident 조회 화면
     */
    index: (req, res, next) => {
        async.waterfall([function (callback) {
            ProcessStatus.find({},function (err, ProcessStatus) {
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
            }else{
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
            res.render("incident/new", {
                companyProcess: companyProcess
            });
        });
    },

    /** 
     * incident 저장
    */
    save: (req, res, next) => {
        
        async.waterfall([function (callback) {
            var newincident = req.body.incident;
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

            ProcessStatus.find({},function (err, ProcessStatus) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                }else{
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
        Incident.findById({
            _id: req.params.id
        }, function (err, incident) {
            if (err) {
                return res.json({
                    success: false,
                    message: err
                });
            } else {
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

                res.render("incident/viewDetail", {
                    incident: incident,
                    user: req.user
                });
            }
        });
    },

    /** 
     * incident 첨부파일 다운로드
     */
    download: (req, res, next) => {
        var filepath = path.join(__dirname, '../../',CONFIG.fileUpload.directory, req.params.path1, req.params.path2);
        res.download(filepath);
    },

    getIncident: (req, res, next) => {

        var search = service.createSearch(req);
        async.waterfall([function (callback) {
            //if (search.findIncident) return callback(null, []);
            Incident.find(search.findIncident, function (err, incident) {
                
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

};