'use strict';

const mongoose = require('mongoose');
const async = require('async');
const ProcessGubunModel = require('../models/ProcessGubun');
const logger = require('log4js').getLogger('app');

module.exports = {

    /**
     * 초기 페이지 출력
     */
    index: (req, res, next) => {
        ProcessGubunModel.find(req.body.processGubun, function (err, processGubun) {
            logger.debug('index 호출');
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
                //if(processGubun.created_at != '') processGubun.created_at = processGubun.created_at.substring(0,10);
                //if(processGubun.register_date != '') processGubun.register_date = processGubun.register_date.substring(0,10);
                
                res.render("processGubun/index", {
                    processGubun: processGubun
                });
            }
        });
    },

    /**
     * 신규 등록 페이지 출력
     */
    new: (req, res, next) => {
        res.render("processGubun/new");
    },

    /**
     * 저장 처리
     */
    save: (req, res, next) => {
        var processGubun = req.body.processGubun;
        logger.debug('body', req.body);
        try{
            ProcessGubunModel.create(req.body.processGubun, function(err, processGubun) {
                //logger.debug('err', err, '\n');
                logger.debug('save 호출');    
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                }
            });
            res.redirect('/processGubun/index');
        }catch(e){
            logger.error(e);
            res.render("http/500", {
                err: err
            });
        }
    },

    /**
     * 상세보기 화면 출력
     */
    show: (req, res, next) => {
    },

    /**
     * 수정화면 출력
     */
    edit: (req, res, next) => {
        try{
            ProcessGubunModel.findById(req.params.id, function(err, processGubun) {
                if (err) return res.json({
                    success: false,
                    message: err
                });
                //if (!req.user._id.equals(question.author)) return res.json({
                //    success: false,
                //    message: "Unauthrized Attempt"
                //});
                res.render("processGubun/edit", {
                    processGubun: processGubun
                    //,user: req.user
                });
            });
        }catch(e){
            logger.error(e);
            res.render("http/500", {
                err: err
            });
        }
    },

    /**
     * 업데이트 처리
     */
    update: (req, res, next) => {
        console.log("Trace update", req.params.id);
        console.log(req.body);
        //req.body.processGubun.updatedAt = Date.now();
        try{
            ProcessGubunModel.findOneAndUpdate({
                _id: req.params.id
                //,author: req.user._id
            }, req.body.processGubun, function(err, processGubun) {
                if (err) return res.json({
                    success: false,
                    message: err
                });
                if (!processGubun) return res.json({
                    success: false,
                    message: "No data found to update"
                });
                res.redirect('/processGubun/' + req.params.id + '/show');
            });
        }catch(e){
            logger.error(e);
            res.render("http/500", {
                err: err
            });
        }
    },

    /**
     * 삭제 처리
     */
    delete: (req, res, next) => {
        logger.debug("Trace delete", req.params.id);
        var processGubun = {};
        processGubun.user_flag = 'N';
        try{
            ProcessGubunModel.findOneAndUpdate({
                _id: req.params.id
                //,author: req.user._id
            }, processGubun, function(err, processGubun) {
                if (err) return res.json({
                    success: false,
                    message: err
                });
                if (!processGubun) return res.json({
                    success: false,
                    message: "No data found to delete"
                });
                res.redirect('/processGubun/index');
            });
            /*
            ProcessGubunModel.findOneAndRemove({
                _id: req.params.id
                //,author: req.user._id
            }, function(err, processGubun) {
                if (err) return res.json({
                    success: false,
                    message: err
                });
                if (!processGubun) return res.json({
                    success: false,
                    message: "No data found to delete"
                });
                //res.render('index', {messages: req.flash('info')});
                res.redirect('/processGubun/list');
            });
            */
        }catch(e){
            logger.error(e);
            res.render("http/500", {
                err: err
            });
        }
    },

    /**
     * 처리구분 JSON 조회
     */
    getJSON :  (req, res, next) => {  
        try{
            async.waterfall([function (callback) {
                //상위코드용 업무처리 개수 조회
                ProcessGubunModel.count({"higher_cd":req.params.higher_cd}, function(err, count) {
                    if (err) return res.json({
                        success: false,
                        message: err
                        });     
                    callback(null, count)
                });
            }], function (err, count) {
                var higher_cd = req.params.higher_cd;
                if(count == 0) higher_cd = '000'; //상위코드용 업무처리가 없으면 공통으로 조회
                ProcessGubunModel.find({"higher_cd":higher_cd}, function(err, processGubun) {
                    if (err){
                         return res.json({
                            success: false,
                            message: err
                            });     
                        }else{
                            res.json(processGubun);
                        }
                });
            });
        }catch(e){
            logger.error("manager control saveReceipt : ",e);
            return res.json({
                success: false,
                message: err
            });
        }
    },
};
