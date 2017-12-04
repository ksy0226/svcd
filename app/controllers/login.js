'use strict';
var express = require('express');
var session = require('express-session');
var async = require('async');
var bodyParser = require('body-parser');
var CONFIG = require('../../config/config.json');
var Usermanage = require('../models/Usermanage');
var CompanyModel = require('../models/Company');
var Incident = require('../models/Incident');
var request = require("request");
var bcrypt = require("bcrypt-nodejs");
var logger = require('log4js').getLogger('app');

var email = "";
var remember_me = "";
var user_nm = "";
module.exports = {
    /**
     * Validation action
     */
    index: (req, res) => {
        if (req.session.user_flag == '1') {
            res.render("main/admin");
        } else {
            res.render("main/user");
        }
    },

    logincheck: (req, res) => {
        try {
            //logger.debug('logincheck is called '+req.body.remember_me);
            if (req.body.remember_me === "on") {
                //logger.debug('req.body.remember_me is on ');
                res.cookie('email', req.body.email);
                res.cookie('remember_me', req.body.remember_me === "on" ? "true" : "undefined");
                res.cookie('user_flag', req.body.user_flag);
                res.cookie('group_flag', req.body.group_flag);
                //res.cookie('password', req.body.password);
                email = req.body.email;
                remember_me = req.body.remember_me;
            } else {
                //logger.debug('req.body.remember_me is off ');
                res.clearCookie('email');
                res.clearCookie('remember_me');
                res.clearCookie('user_flag');
                res.clearCookie('group_flag');
            }

            /**
             * 로그인 정보 매핑
             * usermanage 테이블에서 사용자 1차 검색 (비밀번호 틀릴 시 그룹웨어 검색)
             * usermanage 테이블에 존재않을 시 그룹웨어 검색  
             */ 
            async.waterfall([function (callback) {
                Usermanage.findOne({
                    email: req.body.email
                }).exec(function (err, usermanage) {
                    if (err){ 
                        res.render('index', {
                            email: email,
                            remember_me: remember_me,
                            message: "error : 담당자에게 문의하세요."
                        });
                    }

                    if(usermanage != null){
                        if (usermanage.authenticate(req.body.password))  { //비밀번호가 일치하면 - 고객사
                            if(usermanage.access_yn == 'Y'){
                                usermanage.status = 'OK';
                            }else{
                                usermanage.status = 'FAIL';
                            }
                            callback(null, usermanage);
                        }else{ //비밀번호 일치하지 않으면 그룹사 권한별
                            request({
                                uri: CONFIG.groupware.uri+"/CoviWeb/api/UserInfo.aspx?type=sso&email=" + req.body.email + "&password=" + req.body.password,
                                headers: {
                                    'Content-type': 'application/json'
                                },
                                method: "GET",
                            }, function (err, response, gwUser) {
                                var userInfo = JSON.parse(gwUser);
                                userInfo.user_flag = usermanage.user_flag;
                                userInfo.group_flag = 'in';
                                callback(null, userInfo)
                            });
                        }
                    } else { //usermanage테이블에 계정이 존재하지 않으면 그룹사 일반계정
                        request({
                            uri: CONFIG.groupware.uri+"/CoviWeb/api/UserInfo.aspx?type=sso&email=" + req.body.email + "&password=" + req.body.password,
                            headers: {
                                'Content-type': 'application/json'
                            },
                            method: "GET",
                        }, function (err, response, gwUser) {
                            var userInfo = JSON.parse(gwUser);
                            //운영 시 9로 수정
                            //userInfo.user_flag = '9';
                            userInfo.user_flag = '5';
                            userInfo.group_flag = 'in';
                            callback(null, userInfo);
                        });
                    }
                });
            }], function (err, userInfo) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                } else {

                    if(userInfo.status == 'OK'){
                        req.session.email = userInfo.email;
                        req.session.user_id = userInfo.user_id;
                        req.session.sabun = userInfo.sabun;
                        req.session.password = userInfo.password;
                        req.session.user_flag = userInfo.user_flag;
                        req.session.group_flag = userInfo.group_flag;
                        req.session.user_nm = userInfo.employee_nm;
                        req.session.company_cd = userInfo.company_cd;
                        req.session.company_nm = userInfo.company_nm;
                        req.session.dept_cd = userInfo.dept_cd;
                        req.session.dept_nm = userInfo.dept_nm;
                        req.session.position_nm = userInfo.position_nm;
                        req.session.jikchk_nm = userInfo.jikchk_nm;
                        req.session.office_tel_no = userInfo.office_tel_no;
                        req.session.hp_telno = userInfo.hp_telno;

                        logger.debug("======================================");
                        logger.debug("req.session.user_flag",req.session.user_flag);
                        logger.debug("req.session.group_flag",req.session.group_flag);
                        logger.debug("req.session.dept_cd",req.session.dept_cd);
                        logger.debug("req.session.access_yn",req.session.access_yn);
                        logger.debug("======================================");

                        
                        //>>>>>==================================================
                        //권한에 따른 분기
                        if (req.session.user_flag == '1') {
                            res.render("main/admin");
                        } else if (req.session.user_flag == '5') {
                            res.render("main/deptadmin");
                        } else {
                            res.render("main/user");
                        }
                        //<<<<<==================================================
                    
                    }else{
                        if(userInfo.group_flag != 'in'){
                            //승인여부에 따른 메세지 변경
                            if (userInfo.access_yn == 'N') {
                                res.render('index', {
                                    email: email,
                                    remember_me: remember_me,
                                    message: "미승인 계정입니다.<br>관리팀에 권한을 요청하세요."
                                });
                            } else {
                                res.render('index', {
                                    email: email,
                                    remember_me: remember_me,
                                    message: "등록된 계정이 없습니다.<br>다시 시도해주세요."
                                });
                            }
                        }else{
                            res.render('index', {
                                email: email,
                                remember_me: remember_me,
                                message: "등록된 계정이 없습니다.<br>다시 시도해주세요."
                            });
                        }
                    }
                    
                }
            });
        } catch (e) {
            logger.debug(e);
        }
    },

    logout: (req, res) => {
        //logger.debug('logout is called ');
        //세션삭제
        CompanyModel.find({}, function (err, company) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
                delete req.session.email;
                email = req.cookies.email;
                remember_me = req.cookies.remember_me;

                if (email == null) email = "";
                res.render('index', {
                    email: email,
                    remember_me: remember_me,
                    company: company
                });
            }
        });
    },

    retry: (req, res) => {
        //logger.debug('login.js retry is called ');
        email = req.cookies.email;
        remember_me = req.cookies.remember_me;
        user_flag = req.cookies.user_flag;

        if (req.session.email) {
            res.render('main/main');
        } else {
            if (email == null) email = "";
            res.render('index', {
                email: email,
                remember_me: remember_me
            });
        }
    },

    index1: (req, res, next) => {
        res.render("index1");
    },
    index2: (req, res, next) => {
        res.render("index2");
    },

    //계정신청
    new: (req, res, next) => {
        try {
            logger.debug('Login controller New debug >>> ', req.body.usermanage);
            var usermanage = req.body.usermanage;
            Usermanage.create(req.body.usermanage, function (err, usermanage) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                } else {
                    res.send(usermanage);
                }
            });
        } catch (e) {
            logger.debug('usermanage controllers error ====================> ', e)
        }
    },

    main_list: (req, res, next) => {
        try {
            //logger.debug('main_list controllers start!');
            if (req.session.user_flag == '9') {
                Incident.find({ request_id: req.session.email }, function (err, incident) {
                    if (err) {
                        return res.json({
                            success: false,
                            message: err
                        });
                    } else {
                        res.json(incident);
                    }
                }).sort('-created_at');
            } else if (req.session.user_flag == '5') {
                Incident.find({ manager_dept_cd: req.session.dept_cd }, function (err, incident) {
                    if (err) {
                        return res.json({
                            success: false,
                            message: err
                        });
                    } else {
                        res.json(incident);
                    }
                }).sort('-created_at');
            } else if (req.session.user_flag == '1') {
                Incident.find({}, function (err, incident) {
                    if (err) {
                        return res.json({
                            success: false,
                            message: err
                        });
                    } else {
                        res.json(incident);
                    }
                }).sort('-created_at');
            } else {
                Incident.find({ manager_email: req.session.email }, function (err, incident) {
                    if (err) {
                        return res.json({
                            success: false,
                            message: err
                        });
                    } else {
                        res.json(incident);
                    }
                }).sort('-created_at');
            }
        } catch (e) {
            logger.debug('main_list controllers error ====================> ', e)
            //console.log('main_list controllers error ====================> ', e);
        }
    },

    main_list_nocomplete: (req, res, next) => {
        try {
            if (req.session.user_flag == '9') {
                Incident.find({ request_id: req.session.email, status_cd: "3" }, function (err, incident) {
                    if (err) {
                        return res.json({
                            success: false,
                            message: err
                        });
                    } else {
                        res.json(incident);
                    }
                }).sort('-created_at');
            } else {
                Incident.find({ manager_email: req.session.email, status_cd: "3" }, function (err, incident) {
                    if (err) {
                        return res.json({
                            success: false,
                            message: err
                        });
                    } else {
                        res.json(incident);
                    }
                }).sort('-created_at');
            }
        } catch (e) {
            logger.debug('main_list_nocomplete controllers error ====================> ', e)
            //console.log('main_list_nocomplete controllers error ====================> ', e);
        }
    },

    /**
     * 그룹 인터페이스용 login
     */
    login: (req, res) => {
        try {
            
            logger.debug("======================================");
            logger.debug("req.query.email",req.query.email);
            logger.debug("======================================");

            /**
             * 로그인 정보 매핑
             */ 
            request({
                uri: CONFIG.groupware.uri+"/CoviWeb/api/UserInfo.aspx?email=" + req.query.email + "&password=" + req.query.password,
                headers: {
                    'Content-type': 'application/json'
                },
                method: "GET",
            }, function (err, response, gwUser) {
                var userInfo = JSON.parse(gwUser);
                userInfo.user_flag = '9';
                userInfo.group_flag = 'in';
               
                if(userInfo.status == 'OK'){
                    req.session.email = userInfo.email;
                    req.session.user_id = userInfo.user_id;
                    req.session.sabun = userInfo.sabun;
                    req.session.password = userInfo.password;
                    req.session.user_flag = userInfo.user_flag;
                    req.session.group_flag = userInfo.group_flag;
                    req.session.user_nm = userInfo.employee_nm;
                    req.session.company_cd = userInfo.company_cd;
                    req.session.company_nm = userInfo.company_nm;
                    req.session.dept_cd = userInfo.dept_cd;
                    req.session.dept_nm = userInfo.dept_nm;
                    req.session.position_nm = userInfo.position_nm;
                    req.session.jikchk_nm = userInfo.jikchk_nm;
                    req.session.office_tel_no = userInfo.office_tel_no;
                    req.session.hp_telno = userInfo.hp_telno;

                    logger.debug("====================index login ==================");
                    logger.debug("req.session.user_flag",req.session.user_flag);
                    logger.debug("req.session.group_flag",req.session.group_flag);
                    logger.debug("req.session.dept_cd",req.session.dept_cd);
                    logger.debug("req.session.access_yn",req.session.access_yn);
                    logger.debug("===================================================");

                    //>>>>>==================================================
                    res.render("main/user");
                    //<<<<<==================================================
                }

            });
        } catch (e) {
            logger.debug(e);
        }
    },
};