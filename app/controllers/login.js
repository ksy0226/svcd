'use strict';
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var Usermanage = require('../models/Usermanage');
var bcrypt   = require("bcrypt-nodejs");
var logger = require('log4js').getLogger('app');

var email = "";
var remember_me = "";
var user_nm = "";
module.exports = {
    /**
     * Validation action
     */
    index: (req, res) => {
        //logger.debug('index is called ');
        if (req.session.email) {
            res.render('main/main, {user_flag : req.session.user_flag}');
        } else {
            res.render('index, {user_flag : req.session.user_flag}');
        }
    },
    
    logincheck: (req, res) => {
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
        logger.debug("password : ",bcrypt.hashSync('1'));

        Usermanage.findOne({ //계정이 존재하면
                email : req.body.email
            }).exec(function (err, usermanage) {
                if (err) callback(err);
                if(usermanage.authenticate(req.body.password)){ //비밀번호가 일치하면
                    req.session.save(function () {
                        req.session.email = usermanage.email;
                        req.session.password = usermanage.password;
                        req.session.user_flag = usermanage.user_flag;
                        req.session.group_flag = usermanage.group_flag;
                        req.session.user_nm = usermanage.user_nm;
                        req.session.company_cd = usermanage.company_cd;
                        
                        res.render('main/main',
                                {   user_flag : req.session.user_flag, 
                                    group_flag : req.session.group_flag,
                                    user_nm : req.session.user_nm
                                });

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
        user_flag = req.cookies.user_flag;

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