'use strict';

const mongoose = require('mongoose');
const async = require('async');
const CompanyModel = require('../models/Company');
const logger = require('log4js').getLogger('app');
const Iconv  = require('iconv-lite');

module.exports = {


    list: (req, res, next) => {
        
        CompanyModel.find(req.body.company, function(err, company) {
            //logger.debug('err', err, '\n');
            logger.debug('list 호출');
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }
            //res.send('<script>alert("성공");location.href="/company/new";</script>');
            res.render("company/list", {
                company: company
            });
        });
       
    },

    new: (req, res, next) => {
        res.render("company/new");
    },

    save: (req, res, next) => {
        var company = req.body.company;
        logger.debug('body', req.body);

        CompanyModel.create(req.body.company, function(err, company) {
            //logger.debug('err', err, '\n');
            logger.debug('save 호출');    
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }
            /*
            res.render("company/list", {
                company: company
            });*/
        });
        res.redirect('/company/list');
    },

    show: (req, res, next) => {
       
        logger.debug("Trace Show");
        CompanyModel.findById(req.params.id).exec(function(err, company) {
            if (err) return res.json({
                success: false,
                message: err
            });
            logger.debug('aaa : %s',req._parsedUrl.query);
            res.render("company/show", {
                company: company,
                urlQuery: req._parsedUrl.query
                //user: req.user,
                //search: service.createSearch(req)
            });
        }); 
    },

    edit: (req, res, next) => {
        //req.body.company.updatedAt = Date.now();
        CompanyModel.findById(req.params.id, function(err, company) {
            if (err) return res.json({
                success: false,
                message: err
            });
            //if (!req.user._id.equals(question.author)) return res.json({
            //    success: false,
            //    message: "Unauthrized Attempt"
            //});
            res.render("company/edit", {
                company: company
                //,user: req.user
            });
        });
    },
    update: (req, res, next) => {
        logger.debug("Trace update", req.params.id);
        logger.debug(req.body);
        //req.body.company.updatedAt = Date.now();
        console.log(req.params.id);
        
        CompanyModel.findOneAndUpdate({
            
            _id: req.params.id
            //,author: req.user._id
        }, req.body.company, function(err, company) {
            if (err) return res.json({
                success: false,
                message: err
            });
            if (!company) return res.json({
                success: false,
                message: "No data found to update"
            });
            res.redirect('/company/' + req.params.id + '/show');
        });
    },
    delete: (req, res, next) => {
        logger.debug("Trace delete", req.params.id);

        CompanyModel.findOneAndRemove({
            _id: req.params.id
            //,author: req.user._id
        }, function(err, company) {
            if (err) return res.json({
                success: false,
                message: err
            });
            if (!company) return res.json({
                success: false,
                message: "No data found to delete"
            });
            //res.render('index', {messages: req.flash('info')});
            res.redirect('/company/list');
        });
    },
    exceldownload: (req, res, next) => {
        logger.debug(1);
        CompanyModel.find(req.body.company, function(err, companyJsonData) {
            if (err) return res.json({
                success: false,
                message: err
            });
            logger.debug(companyJsonData);
            //res.json(companyJsonData);
            //res.send({companyJsonData: companyJsonData});
            /*res.render("company/list", {
            companyJsonData: companyJsonData
        });*/
            res.json(companyJsonData);
        });
    }
};
