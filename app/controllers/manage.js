'use strict';

const mongoose = require('mongoose');
const async = require('async');
const User = require('../models/User');
const Question = require('../models/Question');
const Counter = require('../models/Counter');
const service = require('../services/question');
const logger = require('log4js').getLogger('app');
const Iconv  = require('iconv-lite');

module.exports = {

    show: (req, res, next) => {
        res.render("manage/company");
    },
    new: (req, res, next) => {
        res.render("manage/companyNew");
    }

};
