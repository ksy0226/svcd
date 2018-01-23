'use strict';

const mongoose = require('mongoose');
const async = require('async');
const IncidentModel = require('../models/Incident');
const logger = require('log4js').getLogger('app');

module.exports = {

    hr: (req, res, next) => {
        var condition = {};
        condition.higher_cd = 'H008';
        condition.register_yyyy = req.query.yyyy;
        condition.register_mm = req.query.mm;

        
        try{
            IncidentModel.find(condition, function (err, incident) {
                if (err) {
                    res.json(null);
                }else{
                    res.json(incident);
                }
            }).sort('-register_date');
        }catch(e){
            
        }finally{}
    },
};