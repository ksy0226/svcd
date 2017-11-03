'use strict';
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var Usermanage = require('../models/Usermanage');
var CompanyModel = require('../models/Company');
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
        if(req.session.user_flag == '1'){
            res.render("main/admin");
        }else{
            res.render("main/user");
        }
    },

    logincheck: (req, res) => {
        try{
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


                Usermanage.findOne(
                    { email: req.body.email }
                ).exec(function (err, usermanage) {
                    logger.debug("password : ",usermanage.authenticate(req.body.password));
                    if (err) callback(err);
                    //if (usermanage.authenticate(req.body.password)) { //비밀번호가 일치하면
                    if (usermanage.authenticate(req.body.password) && usermanage.access_yn == 'Y') {
                        req.session.save(function () {
                            req.session.email = usermanage.email;
                            req.session.user_id = usermanage.user_id;
                            req.session.password = usermanage.password;
                            req.session.user_flag = usermanage.user_flag;
                            req.session.group_flag = usermanage.group_flag;
                            req.session.user_nm = usermanage.employee_nm;
                            req.session.company_cd = usermanage.company_cd;
                            req.session.company_nm = usermanage.company_nm;
                            req.session.dept_nm = usermanage.dept_nm;
                            req.session.position_nm = usermanage.position_nm;
                            req.session.jikchk_nm = usermanage.jikchk_nm;
                            req.session.office_tel_no = usermanage.office_tel_no;
                            req.session.hp_telno = usermanage.hp_telno;
                            
                            if(req.session.user_flag == '1'){
                                res.render("main/admin");
                            }else{
                                res.render("main/user");
                            }
                            /*
                            res.render('main/main',
                                    {
                                        user_flag: req.session.user_flag,
                                        group_flag: req.session.group_flag,
                                        user_nm: req.session.user_nm,
                                        sabun: req.session.sabun
                                    });
                            */
                        });
                    } else { //계정이 존재하지 않으면

                        request({
                            uri: "http://gw.isu.co.kr/CoviWeb/api/UserInfo.aspx?email=" + req.body.email + "&password=" + req.body.password,
                            headers: {
                                'Content-type': 'application/json'
                            },
                            method: "GET",
                        }, function (err, response, usermanage) {
                            if(JSON.parse(usermanage).status == "OK"){
                                req.session.email = usermanage.email;
                                req.session.user_id = usermanage.user_id;
                                req.session.password = usermanage.password;
                                req.session.user_flag = "9";
                                req.session.group_flag = "in";
                                req.session.user_nm = usermanage.employee_nm;
                                req.session.company_cd = usermanage.company_cd;
                                req.session.company_nm = usermanage.company_nm;
                                req.session.dept_nm = usermanage.dept_nm;
                                req.session.position_nm = usermanage.position_nm;
                                req.session.jikchk_nm = usermanage.jikchk_nm;
                                req.session.office_tel_no = usermanage.office_tel_no;
                                req.session.hp_telno = usermanage.hp_telno;
                                res.render("main/user");
                            }else{
                                if (req.body.remember_me === "on") {
                                    //logger.debug('req.body.remember_me === '+req.body.remember_me)
                                    remember_me = "true";
                                } else {
                                    //logger.debug('req.body.remember_me !== '+req.body.remember_me)
                                    remember_me = "false";
                                }
        
                                if (email == null) email = "";
        
                                //승인여부에 따른 메세지 변경
                                if (usermanage.access_yn == 'N') {
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
                            }
                        });     
                    }
                });

        }catch(e){
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
};