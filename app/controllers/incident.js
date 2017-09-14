'use strict';

const mongoose = require('mongoose');
const async = require('async');
const Incident = require('../models/Incident');
const Counter = require('../models/Counter');
const service = require('../services/incident');
const fs = require('fs');
const path = require('path');
const logger = require('log4js').getLogger('app');

module.exports = {
    /** 
     * incident 조회 화면
     */
    index: (req, res, next) => {
        //logger.debug(incident);
        res.render("incident/index", {
            incident: incident,
            user: req.user,
            page: page,
            maxPage: maxPage,
            urlQuery: req._parsedUrl.query,
            search: search,
            counter: vistorCounter,
            incidentMessage: req.flash("incidentMessage")[0]
        });
    },

    /** 
     * incident 등록 화면
     */
    new: (req, res, next) => {
        res.render("incident/new", {title : req.params.title});
    },

    /** 
     * incident 저장
     */
    save: (req, res, next) => {
        var newincident = req.body.incident;
        if(req.files){
            newincident.attach_file = req.files;
        }
        //logger.debug("newincident = ",newincident);
        Incident.create(newincident, function(err, incident) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }else{
                res.render("incident", {
                    incident: newincident
                });                
            }
        });
    },

    /** 
     * incident 상세 화면
     */
    show: (req, res, next) => {
        res.render("incident/show", {
            incident: incident,
            urlQuery: req._parsedUrl.query,
            user: req.user,
            search: service.createSearch(req)
        });
    },

    /** 
     * incident 수정 화면
     */
    edit: (req, res, next) => {
        res.render("incident/edit", {
            incident: incident,
            user: req.user
        });
    },

    /** 
     * incident 수정 등록
     */
    update: (req, res, next) => {
        res.redirect('/incident/' + req.params.id + '/show');
    },

    /**
     * incident 삭제 
     */
    delete: (req, res, next) => {
        logger.debug("Trace delete", req.params.id);
        Incident.findOneAndRemove({
            _id: req.params.id
            //,author: req.user._id
        }, function (err, incident) {
            if (err) return res.json({
                success: false,
                message: err
            });
            if (!incident) return res.json({
                success: false,
                message: "No data found to delete"
            });
            res.redirect('/incident');
        });
    }
};