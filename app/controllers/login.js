'use strict';
var express = require('express');
var session = require('express-session');
var async = require('async');
var bodyParser = require('body-parser');
var CONFIG = require('../../config/config.json');
var Usermanage = require('../models/Usermanage');
var CompanyModel = require('../models/Company');
var Incident = require('../models/Incident');
var MyProcess = require('../models/MyProcess');
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
        } else if (req.session.user_flag == '3') {
            res.render("main/admin3");
        } else if (req.session.user_flag == '4') {
            res.render("main/admin4");
        } else if (req.session.user_flag == '5') {
            res.render("main/admin5");
        } else {
            res.render("main/user");
        }
    },

    logincheck: (req, res) => {
        try {
            ////logger.debug('logincheck is called '+req.body.remember_me);
            if (req.body.remember_me === "on") {
                ////logger.debug('req.body.remember_me is on ');
                res.cookie('email', req.body.email);
                res.cookie('remember_me', req.body.remember_me === "on" ? "true" : "undefined");
                res.cookie('user_flag', req.body.user_flag);
                res.cookie('group_flag', req.body.group_flag);
                //res.cookie('password', req.body.password);
                email = req.body.email;
                remember_me = req.body.remember_me;
            } else {
                ////logger.debug('req.body.remember_me is off ');
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
                    if (err) {
                        res.render('index', {
                            email: email,
                            remember_me: remember_me,
                            message: "error : 담당자에게 문의하세요."
                        });
                    }

                    if (usermanage != null) {

                        //logger.debug("=================================================================");
                        //logger.debug("usermanage is not null : ", usermanage);
                        //logger.debug("usermanage.authenticate(req.body.password) : ", usermanage.authenticate(req.body.password));
                        //logger.debug("=================================================================");

                        if (usermanage.authenticate(req.body.password)) { //비밀번호가 일치하면 - 고객사

                            if (usermanage.access_yn == 'Y') {
                                usermanage.status = 'OK';
                            } else {
                                usermanage.status = 'FAIL';
                            }
                            callback(null, usermanage);
                        } else { //비밀번호 일치하지 않으면 그룹사 권한별
                            request({
                                uri: CONFIG.groupware.uri + "/CoviWeb/api/UserInfo.aspx?type=sso&email=" + req.body.email + "&password=" + encodeURIComponent(req.body.password),
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

                        //logger.debug("=================================================================");
                        //logger.debug("usermanage is null : ", usermanage, req.body.email);
                        //logger.debug("=================================================================");

                        request({
                            uri: CONFIG.groupware.uri + "/CoviWeb/api/UserInfo.aspx?type=sso&email=" + req.body.email + "&password=" + encodeURIComponent(req.body.password),
                            headers: {
                                'Content-type': 'application/json'
                            },
                            method: "GET",
                        }, function (err, response, gwUser) {
                            var userInfo = JSON.parse(gwUser);
                            //운영 시 9로 수정
                            userInfo.user_flag = '9';
                            //userInfo.user_flag = '5';
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

                    if (userInfo.status == 'OK') {
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

                        //logger.debug("======================================");
                        //logger.debug("req.session.user_flag", req.session.user_flag);
                        //logger.debug("req.session.group_flag", req.session.group_flag);
                        //logger.debug("req.session.dept_cd", req.session.dept_cd);
                        //logger.debug("req.session.access_yn", req.session.access_yn);
                        //logger.debug("======================================");


                        //>>>>>==================================================
                        //권한에 따른 분기
                        if (req.session.user_flag == '1') {
                            res.render("main/admin");
                        } else if (req.session.user_flag == '3') {
                            res.render("main/admin3");
                        } else if (req.session.user_flag == '4') {
                            res.render("main/admin4");
                        } else if (req.session.user_flag == '5') {
                            res.render("main/admin5");
                        } else {
                            res.render("main/user");
                        }
                        //<<<<<==================================================

                    } else {
                        if (userInfo.group_flag != 'in') {
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
                        } else {
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
            //logger.debug(e);
        }
    },

    /**
     * 그룹웨어에서 링크 시
     */
    login: (req, res) => {
        try {

            logger.debug("======================================");
            logger.debug("login req.query.email", req.query.email);
            logger.debug("login req.query.password", req.query.password);
            logger.debug("url : ", CONFIG.groupware.uri + "/CoviWeb/api/UserInfo.aspx?email=" + req.query.email + "&password=" + encodeURIComponent(req.query.password));
            logger.debug("======================================");

            /**
             * 로그인 정보 매핑
             * usermanage 테이블에서 사용자 1차 검색 (비밀번호 틀릴 시 그룹웨어 검색)
             * usermanage 테이블에 존재않을 시 그룹웨어 검색  
             */
            async.waterfall([function (callback) {

                request({
                    uri: CONFIG.groupware.uri + "/CoviWeb/api/UserInfo.aspx?email=" + req.query.email + "&password=" + encodeURIComponent(req.query.password),
                    //uri: CONFIG.groupware.uri + "/CoviWeb/api/UserInfo.aspx?email=hilee@isu.co.kr&password=3DE413271C5D3573FC9BF9BF78A9CDFB",
                    //email=hilee@isu.co.kr&password=3DE413271C5D3573FC9BF9BF78A9CDFB
                    headers: {
                        'Content-type': 'application/json'
                    },
                    method: "GET",
                }, function (err, response, gwUser) {

                    //logger.debug("======================================");
                    //logger.debug("gwUserr", JSON.stringify(gwUser));
                    //logger.debug("======================================");

                    var userInfo = JSON.parse(gwUser);
                    userInfo.user_flag = '9';
                    userInfo.group_flag = 'in';
                    callback(null, userInfo)
                });

            }], function (err, userInfo) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                } else {

                    if (userInfo.status == 'OK') {

                        //logger.debug("======================================");     
                        //logger.debug("====================>userInfo.status : ",userInfo.status);
                        //logger.debug("======================================");

                        req.session.email = userInfo.email;
                        req.session.user_id = userInfo.user_id;
                        req.session.sabun = userInfo.sabun;
                        req.session.password = userInfo.password;
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

                        Usermanage.findOne({
                            email: req.query.email
                        }).exec(function (err, usermanage) {
                            if (err) {
                                res.render('index', {
                                    email: email,
                                    remember_me: remember_me,
                                    message: "error : 담당자에게 문의하세요."
                                });
                            } else {
                                if(usermanage == null){
                                    userInfo.user_flag = '9';
                                }else{
                                    req.session.user_flag = usermanage.user_flag;
                                }
                                //logger.debug("======================================");
                                //logger.debug("req.session.user_flag", req.session.user_flag);
                                //logger.debug("req.session.group_flag", req.session.group_flag);
                                //logger.debug("req.session.dept_cd", req.session.dept_cd);
                                //logger.debug("req.session.access_yn", req.session.access_yn);
                                //logger.debug("======================================");

                                //>>>>>==================================================
                                //권한에 따른 분기
                                if (req.session.user_flag == '1') {
                                    res.render("main/admin");
                                } else if (req.session.user_flag == '3') {
                                    res.render("main/admin3");
                                } else if (req.session.user_flag == '4') {
                                    res.render("main/admin4");
                                } else if (req.session.user_flag == '5') {
                                    res.render("main/admin5");
                                } else {
                                    res.render("main/user");
                                }
                                //<<<<<==================================================
                            }
                        });
                    } else {

                        res.render('index', {
                            email: email,
                            remember_me: remember_me,
                            message: "등록된 계정이 없습니다.<br>다시 시도해주세요."
                        });

                    }
                }
            });
        } catch (e) {
            //logger.debug(e);
        }
    },

    /**
     * stlc 링크 시
     */
    loginstlc: (req, res) => {
        
        try {
            
            /**
             * 로그인 정보 매핑
             * usermanage 테이블에서 사용자 1차 검색 (비밀번호 틀릴 시 그룹웨어 검색)
             * usermanage 테이블에 존재않을 시 그룹웨어 검색  
             */
                Usermanage.findOne({
                    email: req.query.email
                }).exec(function (err, usermanage) {
                    if (err) {
                        res.render('index', {
                            email: email,
                            remember_me: remember_me,
                            message: "error : 담당자에게 문의하세요."
                        });
                    }

                    //logger.debug("=================================================================");
                    //logger.debug("req.query.email : ", req.query.email);
                    //logger.debug("=================================================================");

                    if (usermanage != null) {

                        //logger.debug("=================================================================");
                        //logger.debug("usermanage is not null : ", usermanage);
                        //logger.debug("=================================================================");

                        if (req.query.key == "$2a$10$0bnBGRBBgiLTMPc8M8LZIuNjErIdMLGOI6SPjLxlIVIhi81HOA0U6") { //키값이 일치하면 - 고객사

                            req.session.email = usermanage.email;
                            req.session.user_id = usermanage.user_id;
                            req.session.sabun = usermanage.sabun;
                            req.session.password = usermanage.password;
                            req.session.user_flag = usermanage.user_flag;
                            req.session.group_flag = usermanage.group_flag;
                            req.session.user_nm = usermanage.employee_nm;
                            req.session.company_cd = usermanage.company_cd;
                            req.session.company_nm = usermanage.company_nm;
                            req.session.dept_cd = usermanage.dept_cd;
                            req.session.dept_nm = usermanage.dept_nm;
                            req.session.position_nm = usermanage.position_nm;
                            req.session.jikchk_nm = usermanage.jikchk_nm;
                            req.session.office_tel_no = usermanage.office_tel_no;
                            req.session.hp_telno = usermanage.hp_telno;

                            //>>>>>==================================================
                            //권한에 따른 분기
                            if (req.session.user_flag == '1') {
                                res.render("main/admin");
                            } else if (req.session.user_flag == '3') {
                                res.render("main/admin3");
                            } else if (req.session.user_flag == '4') {
                                res.render("main/admin4");
                            } else if (req.session.user_flag == '5') {
                                res.render("main/admin5");
                            } else {
                                res.render("main/user");
                            }
                            //<<<<<==================================================
                           
                        } else { //key 일치하지 않으면 
                            res.render('index', {
                                email: email,
                                remember_me: remember_me,
                                message: "등록된 계정이 없습니다.<br>다시 시도해주세요."
                            });
                        }
                    } else { //usermanage테이블에 계정이 존재하지 않으면 그룹사 일반계정

                        //logger.debug("=================================================================");
                        //logger.debug("usermanage is null : ", usermanage, req.body.email);
                        //logger.debug("=================================================================");

                        res.render('index', {
                            email: email,
                            remember_me: remember_me,
                            message: "등록된 계정이 없습니다.<br>다시 시도해주세요."
                        });
                    }
                });       
         
        } catch (e) {
            //logger.debug(e);
        }
    },


    logout: (req, res) => {

        delete req.session.email;
        email = req.cookies.email;
        remember_me = req.cookies.remember_me;

        if (email == null) email = "";

        res.render('index', {
            email: email,
            remember_me: remember_me
        });

    },

    retry: (req, res) => {
        ////logger.debug('login.js retry is called ');
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
            //logger.debug('Login controller New debug >>> ', req.body.usermanage);
            var usermanage = req.body.usermanage;

            logger.debug("===============================")
            logger.debug("req.body.usermanage : ", JSON.stringify(req.body.usermanage) );
            logger.debug("===============================")

            Usermanage.create(req.body.usermanage, function (err, usermanage) {
                if (err) {
                    logger.debug("===============================")
                    logger.debug("err : ", err );
                    logger.debug("===============================")
        
                    res.render("http/500", {
                        err: err
                    });
                } else {
                    logger.debug("===============================")
                    logger.debug("usermanage : ", usermanage );
                    logger.debug("JSON.stringify(req.body.usermanage) : ", JSON.stringify(req.body.usermanage) );
                    logger.debug("===============================")
                    
                    res.send(usermanage);
                }
            });
        } catch (e) {
            //logger.debug('usermanage controllers error ====================> ', e)
        }
    },

    main_list: (req, res, next) => {


        try {
            if (req.session.user_flag == '9') {
                Incident.find({
                    request_id: req.session.email
                }, function (err, incident) {

                    //logger.debug("======================================");
                    //logger.debug("incident : ", incident);
                    //logger.debug("======================================");

                    if (err) {
                        return res.json({
                            success: false,
                            message: err
                        });
                    } else {
                        res.json(incident);
                    }
                }).sort('-register_date')
                    .limit(10);
            } else if (req.session.user_flag == '5') {

                Incident.find({
                    request_company_cd: req.session.company_cd
                }, function (err, incident) {
                    if (err) {
                        return res.json({
                            success: false,
                            message: err
                        });
                    } else {
                        res.json(incident);
                    }
                }).sort('-register_date')
                    .limit(10);

            } else if (req.session.user_flag == '4') {

                var AndQueries = [];
                var condition = {};
                var condition2 = {};
                condition2.email = req.session.email;

                async.waterfall([function (callback) {
                    MyProcess.find(condition2).distinct('higher_cd').exec(function (err, myHigherProcess) {
                        
                        logger.debug("======================================");
                        logger.debug("condition2 : ", condition2);
                        logger.debug("======================================");
                        
                        if (condition.$and == null) {
                            condition.$and = [{
                                "higher_cd": {
                                    "$in": myHigherProcess
                                }
                            }];
                        } else {
                            condition.$and.push({
                                "higher_cd": {
                                    "$in": myHigherProcess
                                }
                            });
                        }

                        callback(null, myHigherProcess)
                    
                    }).sort('-register_date')
                    .limit(10);
                }], function (err, myHigherProcess) {

                        Incident.find(condition, function (err, incident) {

                            logger.debug("======================================");
                            logger.debug("condition2 : ", condition2);
                            logger.debug("======================================");
                            
                            //logger.debug("======================================");
                            //logger.debug("incident : ", incident);
                            //logger.debug("======================================");


                        if (err) {
                            return res.json({
                                success: false,
                                message: err
                            });
                        } else {
                            res.json(incident);
                        }
                    }).sort('-register_date')
                    .limit(10);
                });
            } else if (req.session.user_flag == '3') {

                Incident.find({
                    manager_dept_cd: req.session.dept_cd
                }, function (err, incident) {
                    if (err) {
                        return res.json({
                            success: false,
                            message: err
                        });
                    } else {
                        res.json(incident);
                    }
                }).sort('-register_date')
                    .limit(10);

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
                }).sort('-register_date')
                    .limit(10);

            } else {

                Incident.find({
                    manager_email: req.session.email
                }, function (err, incident) {
                    if (err) {
                        return res.json({
                            success: false,
                            message: err
                        });
                    } else {
                        res.json(incident);
                    }
                }).sort('-register_date')
                    .limit(10);

            }
        } catch (e) {

        }
    },

    main_list_nocomplete: (req, res, next) => {
        var today = new Date();
        var thisYear = today.getFullYear();

        try {
            if (req.session.user_flag == '9') {
                Incident.find({
                    request_id: req.session.email,
                    status_cd: '3',
                    register_yyyy: thisYear.toString()
                }, function (err, incident) {

                    logger.debug("======================================");
                    logger.debug("incident : ", incident);
                    logger.debug("======================================");

                    if (err) {
                        return res.json({
                            success: false,
                            message: err
                        });
                    } else {
                        res.json(incident);
                    }
                }).sort('-register_date');
            } else {
                Incident.find({
                    manager_email: req.session.email,
                    status_cd: "3"
                }, function (err, incident) {
                    if (err) {
                        return res.json({
                            success: false,
                            message: err
                        });
                    } else {
                        res.json(incident);
                    }
                }).sort('-register_date');
            }
        } catch (e) {

        }
    },

};