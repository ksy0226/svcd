'use strict';

const mongoose = require('mongoose');
const async = require('async');
const HigherProcessModel = require('../models/HigherProcess');
const logger = require('log4js').getLogger('app');
const Iconv  = require('iconv-lite');

module.exports = {

    list: (req, res, next) => {

        HigherProcessModel.find(req.body.higherProcess, function(err, higherProcess) {
            //logger.debug('err', err, '\n');
            //console.log(higherProcess);
            logger.debug('list 호출');
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
                res.render("higherProcess/list", {
                    higherProcess: higherProcess
                });
            }
        });
    },

    new: (req, res, next) => {
        res.render("higherProcess/new");
    },

    save: (req, res, next) => {
        var higherProcess = req.body.higherProcess;
        logger.debug('body', req.body);

        HigherProcessModel.create(req.body.higherProcess, function(err, higherProcess) {
            //logger.debug('err', err, '\n');
            logger.debug('save 호출');    
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }
        });
        res.redirect('/higherProcess/list');
    },

    show: (req, res, next) => {
        logger.debug("Trace Show");
        HigherProcessModel.findById(req.params.id).exec(function(err, higherProcess) {
            if (err) return res.json({
                success: false,
                message: err
            });
            logger.debug('aaa : %s',req._parsedUrl.query);
            res.render("higherProcess/show", {
                higherProcess: higherProcess,
                urlQuery: req._parsedUrl.query
                //user: req.user,
                //search: service.createSearch(req)
            });
        }); 
    },

    edit: (req, res, next) => {
        HigherProcessModel.findById(req.params.id, function(err, higherProcess) {
            if (err) return res.json({
                success: false,
                message: err
            });
            //if (!req.user._id.equals(question.author)) return res.json({
            //    success: false,
            //    message: "Unauthrized Attempt"
            //});
            res.render("higherProcess/edit", {
                higherProcess: higherProcess
                //,user: req.user
            });
        });
    },

    update: (req, res, next) => {
        console.log("Trace update", req.params.id);
        console.log(req.body);
        //req.body.higherProcess.updatedAt = Date.now();
        HigherProcessModel.findOneAndUpdate({
            _id: req.params.id
            //,author: req.user._id
        }, req.body.higherProcess, function(err, higherProcess) {
            if (err) return res.json({
                success: false,
                message: err
            });
            if (!higherProcess) return res.json({
                success: false,
                message: "No data found to update"
            });
            res.redirect('/higherProcess/' + req.params.id + '/show');
        });
    },

    delete: (req, res, next) => {
        logger.debug("Trace delete", req.params.id);

        HigherProcessModel.findOneAndRemove({
            _id: req.params.id
            //,author: req.user._id
        }, function(err, higherProcess) {
            if (err) return res.json({
                success: false,
                message: err
            });
            if (!higherProcess) return res.json({
                success: false,
                message: "No data found to delete"
            });
            //res.render('index', {messages: req.flash('info')});
            res.redirect('/higherProcess/list');
        });
    },

    getHigherProcess :  (req, res, next) => {   
        try{
            HigherProcessModel.find({"company_cd":req.query.company_cd}, function(err, higherProcess) {
                if (err) return res.json({
                    success: false,
                    message: err
                    });     
                res.json(higherProcess);
            });
        }catch(e){
            logger.debug(e);
        }
    },
};
