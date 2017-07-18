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
     index : (req, res) => {


       if(req.session.username){
         console.log("index page ");
       //res.render('../views/login/login');

         res.render('index');
       }else{
          console.log("login page ");
         res.render('login/login');


       }
     },
    logincheck: (req, res) => {


      if(req.body.idsavecheck !=null){
        //console.log("req.body.username    "+req.body.username);
        console.log("1 : "+req.body.idsavecheck);
        //res.clearCookie('username');
        //res.clearCookie('idsave');
        console.log("req.body.username :" + req.body.username);
        //console.log("cookieusername :" + username);
        res.cookie('username',  req.body.username);
        res.cookie('idsave', req.body.idsavecheck=="on" ? "true" : "undefined");
        username =req.body.username;
        idsave = req.body.idsavecheck;
        //idsave =req.body.idsavecheck;
        console.log(req.cookies);
        console.log("username   : " + username); //2



      }else{
        console.log("2 : "+req.body.idsavecheck);
        res.clearCookie('username');
        res.clearCookie('idsave');
      }

      //console.log('validation check....');
      Employee.find({
        //id : req.body.username,
        //pw : req.body.password
      })
      //.populate('id')
      .exec(function(err,employee){
        if (err) callback(err);
        for(var i=0;i<employee.length;i++){
          var idArray=  employee[i].id;
          //console.log(employee[i].id);
          //console.log(idArray);
          var pwArray= employee[i].pw;

          var uname = req.body.username;
          var pwd = req.body.password;

/*
          if(idArray.indexOf(uname)!== -1 ){
            console.log('isExist');
          }else{
            console.log('nonExist');
          }
          //console.log(employee[i].pw);
          */
        }

       if(uname === idArray && pwd === pwArray ){
         //console.log('id & pw are same');
         req.session.username = idArray;
         req.session.password = pwArray;
         //res.send(`<h1>Hello1, ${req.session.username}</h1><a href="/auth/logout">logout</a>`);
         //res.render('index', { title: 'Express' });
         //console.log('login complete');
         req.session.save(function(){
           req.session.username = uname;
           req.session.password = pwd;

           //console.log("session username  is  : "+req.session.username);
           //console.log("session password  is  : "+req.session.password);
           res.render('index');
         });
       }else{ //ID, PW 일치하지 않으면,
         console.log("2   username   : "+username);
         //res.cookie('username',  req.body.username);
         //res.cookie('idsave', req.body.idsavecheck);
         if(req.body.idsavecheck !=null){
            username = req.body.username;
            idsave = req.body.idsavecheck;
           //req.body.idsavecheck.checked = true;
           console.log("check : "+req.body.idsavecheck);

         }else{
            username = "";
            idsave = "";
           //console.log("check : "+req.body.idsavecheck);
         }

         console.log("12345"+idsave);

         if (req.body.idsavecheck === "on") {
           console.log("111");
           idsave= "true";
           console.log("last" + idsave);
         }else{
           console.log("222");
          idsave= "false";
           console.log("last" + idsave);
         }


         if(username==null) username ="";
           res.render('login/login', {
             nameCookie : username,
             saveCookie : idsave
           });



          //res.send('Who are you?<a href="/auth/login">login</a>');
          //res.send('Who are you? ID or Password is wrong!! <br/><a href="/auth/login">login</a>');
          //res.render('login/login');
          //  req.session.save(function(){
          //res.redirect('../views/login/login');
          //  });
        }
      });
    },
    logout : (req, res) => {
      delete req.session.username; //세션삭제

      username =req.cookies.username;
      idsave = req.cookies.idsave;

      console.log("idsave "+ idsave);

      if(username==null) username ="";
        res.render('login/login', {
          nameCookie : username,
          saveCookie : idsave
        });
      //res.redirect('/auth/logout');
      //res.redirect('/welcome');
    },
    retry : (req, res) => {
      username =req.cookies.username;
      idsave = req.cookies.idsave;

      if(req.session.username){
      //res.render('../views/login/login');
        res.render('index');
      }else{
        if(username==null) username ="";
          res.render('login/login', {
            nameCookie : username,
            saveCookie : idsave
          });
      }
    }


};
