'use strict';
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
//var Employee = require('../models/Employee');
var Usermanage = require('../models/Usermanage');
const logger = require('log4js').getLogger('app');

var email = "";
var remember_me = "";
var userNm = "";
module.exports = {
    /**
     * Validation action
     */
    index: (req, res) => {
        //logger.debug('index is called ');
        if (req.session.email) {
            res.render('main/main, {userFlag : req.session.userFlag}');
        } else {
            res.render('index, {userFlag : req.session.userFlag}');
        }
    },
    
    logincheck: (req, res) => {
        //logger.debug('logincheck is called '+req.body.remember_me);

        if (req.body.remember_me === "on") {
            //logger.debug('req.body.remember_me is on ');
            res.cookie('email', req.body.email);
            res.cookie('remember_me', req.body.remember_me === "on" ? "true" : "undefined");
            res.cookie('userFlag', req.body.userFlag);
            res.cookie('groupFlag', req.body.groupFlag);
            //res.cookie('password', req.body.password);
            email = req.body.email;
            remember_me = req.body.remember_me;
        } else {
            //logger.debug('req.body.remember_me is off ');
            res.clearCookie('email');
            res.clearCookie('remember_me');
            res.clearCookie('userFlag');
            res.clearCookie('groupFlag');
        }
        Usermanage.findOne({ //계정이 존재하면
                email : req.body.email,
                password : req.body.password
            }).exec(function (err, usermanage) {
                if (err) callback(err);
                if(usermanage){
                    req.session.save(function () {
                        req.session.email = usermanage.email;
                        req.session.password = usermanage.password;
                        req.session.userFlag = usermanage.userFlag;
                        req.session.groupFlag = usermanage.groupFlag;
                        req.session.userNm = usermanage.userNm;
                        
                        //logger.debug('req.session.userFlag'+req.session.userFlag);
                        res.render('main/main',
                                {   userFlag : req.session.userFlag, 
                                    groupFlag : req.session.groupFlag,
                                    userNm : req.session.userNm
                                });
                        //logger.debug('req.session.userFlag2222'+req.session.userFlag);
                        //logger.debug('userNm'+req.session.userNm);
                    });
                }else{ //계정이 존재하지 않으면
                    if(req.body.remember_me === "on"){
                        //logger.debug('req.body.remember_me === '+req.body.remember_me)
                        remember_me = "true";
                    }else{
                        //logger.debug('req.body.remember_me !== '+req.body.remember_me)
                        remember_me = "false";
                    }

                    if(email == null) email = "";
                    res.render('index', {
                        email : email,
                        remember_me : remember_me,
                        message : "등록된 계정이 없습니다. 다시 시도하세요."
                    });
                }
            });
    },
    logout: (req, res) => {
        //logger.debug('logout is called ');
        //세션삭제
        delete req.session.email;

        email = req.cookies.email;
        remember_me = req.cookies.remember_me;

        if (email == null) email = "";
        res.render('index', {
            email : email,
            remember_me : remember_me
        });
    },
    retry: (req, res) => {
        //logger.debug('login.js retry is called ');
        email = req.cookies.email;
        remember_me = req.cookies.remember_me;
        userFlag = req.cookies.userFlag;

        if(req.session.email){
            res.render('main/main');
        }else{
            if (email == null) email = "";
            res.render('index', {
                email : email,
                remember_me : remember_me
            });
        }
    },
    index1: (req, res, next) => {
        res.render("index1");
    },
    index2: (req, res, next) => {
        res.render("index2");
    },

};