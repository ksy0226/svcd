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
        console.log('req.query.searchText : ' + req.query.searchText);
        
        var search = service.createSearch(req);
       
        async.waterfall([function (callback) {
            console.log('search.findIncident : ' , search.findIncident);
            
            
            //if (search.findIncident) return callback(null, []);
            Incident.find(search.findIncident, function (err, incident) {
                
                logger.debug('2 : ' , search.findIncident.$or);
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
            res.render("incident/index", {
                incident: incident,
                searchType: req.query.searchType,
                searchText: req.query.searchText,
                status_nm: req.query.status_nm
            });
        });
    },


    /** 
     * incident 등록 화면
     */
    new: (req, res, next) => {
        async.waterfall([function (callback) {
            CompanyProcess.find({ "company_cd": req.session.company_cd }, function (err, companyProcess) {
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
        if (req.files) {
            newincident.attach_file = req.files;
        }
        logger.debug("newincident = ", newincident);
        Incident.create(newincident, function (err, incident) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
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
        logger.debug("Trace download : ", req.params.id);
        Incident.findById({
            _id: req.params.id
        }, function (err, incident) {
            var fileid = req.params.id;
            var filename = req.params.filename;
            var filepath = __dirname + "/../../upload-file/" + fileid + "/" + filename;
            res.download(filepath);
        });
    }
};