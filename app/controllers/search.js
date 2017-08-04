'use strict';

const mongoose = require('mongoose');
const async = require('async');
const CompanyModel = require('../models/Company');
const logger = require('log4js').getLogger('app');
const Iconv  = require('iconv-lite');

module.exports = {


    viewall: (req, res, next) => {
        /*
        CompanyModel.find(req.body.company, function(err, company) {
            //logger.debug('err', err, '\n');
            logger.debug('list 호출');
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }
            //res.send('<script>alert("성공");location.href="/search/list";</script>');
            
            res.render("search/list", {
                company: company
            });
            
        });
        */
        res.render("search/viewall");
    },

    viewdetail: (req, res, next) => {
        /*
        Usermanage.findById(req.params.id, function (err, usermanage) {
            if (err) return res.json({
                success: false,
                message: err
            });
            res.render("search/viedetail");
        });
        */

        res.render("search/viewdetail");
    },
};
