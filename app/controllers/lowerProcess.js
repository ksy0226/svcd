'use strict';

const mongoose = require('mongoose');
const async = require('async');
//const CompanyModel = require('../models/Company');
const HigherProcessModel = require('../models/HigherProcess');
const logger = require('log4js').getLogger('app');
const Iconv  = require('iconv-lite');

module.exports = {

    list: (req, res, next) => {

        
        res.render("lowerProcess/list", {

        });
    }
};
