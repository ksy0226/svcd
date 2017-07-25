'use strict';
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var Employee = require('../../app/models/Employee');

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

    if (req.body.idsavecheck != null) {
      res.cookie('email', req.body.email);
      res.cookie('idsave', req.body.idsavecheck == "on" ? "true" : "undefined");
      email = req.body.email;
      idsave = req.body.idsavecheck;
    } else {
      res.clearCookie('email');
      res.clearCookie('idsave');
    }
    Employee.find({
      //id : req.body.email,
      //pw : req.body.password
    })
      //.populate('id') wherd 조건 id뽑기
      .exec(function (err, employee) {
        if (err) callback(err);
        for (var i = 0; i < employee.length; i++) {
          var idArray = employee[i].id;
          var pwArray = employee[i].pw;

          var uname = req.body.email;
          var pwd = req.body.password;
        }

        if (uname === idArray && pwd === pwArray) {

          req.session.email = idArray;
          req.session.password = pwArray;

          req.session.save(function () {
            req.session.email = uname;
            req.session.password = pwd;
            res.render('main/main');
          });

        } else { //ID, PW 일치하지 않으면,

          if (req.body.idsavecheck != null) {
            email = req.body.email;
            idsave = req.body.idsavecheck;
          } else {
            email = "";
            idsave = "";

          }

          if (req.body.idsavecheck === "on") {
            idsave = "true";
          } else {
            idsave = "false";
          }

          if (email == null) email = "";
          res.render('index', {
            nameCookie: email,
            saveCookie: idsave
          });
        }
      });
  },
  logout: (req, res) => {
    delete req.session.email; //세션삭제

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

    if (req.session.email) {
      res.render('main/main');
    } else {
      if (email == null) email = "";
      res.render('index', {
        nameCookie: email,
        saveCookie: idsave
      });
    }
  }
};
