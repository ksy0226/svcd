'use strict';
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var Employee = require('../models/Employee');
const logger = require('log4js').getLogger('app');

var email = "";
var idsave = "";
module.exports = {
    /**
     * Validation action
     */
    index: (req, res) => {
        if (req.session.email) {
            console.log("index page");
            res.render('main/main');
        } else {
            console.log("login page");
            res.render('index');
        }
    },
    
    logincheck: (req, res) => {
        
        if (req.body.remember_me != null) {
            res.cookie('email', req.body.email);
            res.cookie('idsave', req.body.remember_me == "on" ? "true" : "undefined");
            email = req.body.email;
            idsave = req.body.remember_me;
        } else {
            res.clearCookie('email');
            res.clearCookie('idsave');
        }

        logger.debug("=====> : req.body.remember_me "+req.body.remember_me);

        Employee.findOne({
                email : req.body.email,
                pwd : req.body.password
            }).exec(function (err, employee) {
                if (err) callback(err);

                if(employee){
                    req.session.save(function () {
                        req.session.email = employee.email;
                        req.session.password = employee.pwd;
                        res.render('main/main');
                    });

                }else{ //ID, PW 일치하지 않으면,
                    if (req.body.remember_me != null){
                        email = req.body.email;
                        idsave = req.body.remember_me;
                    }else{
                        email = "";
                        idsave = "";
                    }

                    if(req.body.remember_me === "on"){
                        idsave = "true";
                    }else{
                        idsave = "false";
                    }

                    if(email == null) email = "";
                    res.render('index', {
                        nameCookie: email,
                        saveCookie: idsave,
                        message: "등록된 계정이 없습니다. 다시 시도하세요."
                    });
                }
            });
    },
    logout: (req, res) => {
        //세션삭제
        delete req.session.email;

        email = req.cookies.email;
        idsave = req.cookies.idsave;

        if (email == null) email = "";
        res.render('index', {
            nameCookie: email,
            saveCookie: idsave
        });
        //res.redirect('/auth/logout');
        //res.redirect('/welcome');
    },
    retry: (req, res) => {
        email = req.cookies.email;
        idsave = req.cookies.idsave;

        if(req.session.email){
            res.render('main/main');
        }else{
            if (email == null) email = "";
            res.render('index', {
                nameCookie: email,
                saveCookie: idsave
            });
        }
    }
};