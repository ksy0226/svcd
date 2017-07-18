'use strict';
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var Employee = require('../../app/models/Employee');
//var Employee = require('./app/models/Question');
var username = "";
var idsave = "";
module.exports = {
  /**
   * Validation action
   */
  index: (req, res) => {
    if (req.session.username) {
      console.log("index page");
      res.render('main');
    } else {
      console.log("login page");
      res.render('index');
    }
  },
  logincheck: (req, res) => {

    if (req.body.idsavecheck != null) {
      res.cookie('username', req.body.username);
      res.cookie('idsave', req.body.idsavecheck == "on" ? "true" : "undefined");
      username = req.body.username;
      idsave = req.body.idsavecheck;
    } else {
      console.log("2 : " + req.body.idsavecheck);
      res.clearCookie('username');
      res.clearCookie('idsave');
    }
    Employee.find({
      //id : req.body.username,
      //pw : req.body.password
    })
      //.populate('id') wherd 조건 id뽑기
      .exec(function (err, employee) {
        if (err) callback(err);
        for (var i = 0; i < employee.length; i++) {
          var idArray = employee[i].id;
          var pwArray = employee[i].pw;

          var uname = req.body.username;
          var pwd = req.body.password;
        }

        if (uname === idArray && pwd === pwArray) {

          req.session.username = idArray;
          req.session.password = pwArray;

          req.session.save(function () {
            req.session.username = uname;
            req.session.password = pwd;
            res.render('main');
          });

        } else { //ID, PW 일치하지 않으면,

          if (req.body.idsavecheck != null) {
            username = req.body.username;
            idsave = req.body.idsavecheck;
          } else {
            username = "";
            idsave = "";

          }

          if (req.body.idsavecheck === "on") {
            idsave = "true";
          } else {
            idsave = "false";
          }

          if (username == null) username = "";
          res.render('index', {
            nameCookie: username,
            saveCookie: idsave
          });
        }
      });
  },
  logout: (req, res) => {
    delete req.session.username; //세션삭제

    username = req.cookies.username;
    idsave = req.cookies.idsave;

    if (username == null) username = "";
    res.render('index', {
      nameCookie: username,
      saveCookie: idsave
    });
    //res.redirect('/auth/logout');
    //res.redirect('/welcome');
  },
  retry: (req, res) => {
    username = req.cookies.username;
    idsave = req.cookies.idsave;

    if (req.session.username) {
      res.render('main');
    } else {
      if (username == null) username = "";
      res.render('index', {
        nameCookie: username,
        saveCookie: idsave
      });
    }
  }
};
