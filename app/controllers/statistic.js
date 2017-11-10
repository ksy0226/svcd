'use strict';

const mongoose = require('mongoose');
const async = require('async');
const IncidentModel = require('../models/Incident');
const logger = require('log4js').getLogger('app');

module.exports = {
    /**
     * 회사별 상위업무 통계
     */
    com_higher: (req, res, next) => {

        var aggregatorOpts = [
            /*
            { 
                $match : { //조건
                            request_company_cd : "ISU_CH",
                            higher_cd : "H010"
                         }
            },    
            */
            { 
                $group : { //그룹칼럼
                            _id: {
                                request_company_cd: "$request_company_cd"
                                //higher_cd: "$higher_cd",
                                //lower_cd: "$lower_cd"
                            },
                            count: {
                                $sum: 1
                            }
                         }
              }
        ]

        IncidentModel.aggregate(aggregatorOpts)
            .exec(function (err, incident) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                } else {
                    logger.debug("===========", incident);
                    //res.json(result);
                    incident: incident
                }
            });

    },

    /**
     * 상위별 하위업무 통계
     */
    high_lower: (req, res, next) => {
        /*
        IncidentModel.find(req.body.incident, function (err, incident) {
            //logger.debug('err', err, '\n');
            logger.debug('list 호출');
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }
            res.render("statistic/high_lower", {
                incident: incident
            });
        });
        */
        var aggregatorOpts = [
            
            { 
                $match : { //조건
                            request_company_cd : "ISU_ST"
                            ,higher_cd : "H001"
                            ,$or: [ { status_cd : "2" }, { status_cd : "3" }, { status_cd : "4" }]
                            
                         }
            }
               
            
            ,{ 
                $group : { //그룹칼럼
                    _id: {
                        //request_company_cd: "$request_company_cd"
                        higher_cd: "$higher_cd"
                        ,lower_cd: "$lower_cd"
                    }
                    ,count: {
                        $sum: 1
                    }
                    //,total: {
                    //    $sum: "$amount"
                    //}
                }
            }
              
              
              
        ]
        console.log('aggregatorOpts'+aggregatorOpts);

        IncidentModel.aggregate(aggregatorOpts)
            .exec(function (err, incident) {
                console.log("incident"+JSON.stringify(incident));
                //incident=JSON.parse(incident);
                console.log("incident count "+incident);
                console.log("incident higher_cd "+incident[0].higher_cd);
                console.log("incident higher_nm "+incident[0].higher_nm);
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                } else {
                    logger.debug("===========", incident);
                    //res.json(result);
                    incident: incident
                }
                console.log("1 :"+incident);
                console.log("2 : "+JSON.stringify(incident[0].higher_nm));

                res.render("statistic/high_lower", {
                    incident: incident
                });
            });

            



    },

    /**
     * 담당자별 월별처리 내역
     */
    mng_month: (req, res, next) => {
        IncidentModel.find(req.body.incident, function (err, incident) {
            //logger.debug('err', err, '\n');
            logger.debug('list 호출');
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }
            res.render("statistic/mng_month", {
                incident: incident
            });
        });
    },

    /**
     * 처리구분별 월별처리 내역
     */
    status_list: (req, res, next) => {
        IncidentModel.find(req.body.incident, function (err, incident) {
            //logger.debug('err', err, '\n');
            logger.debug('list 호출');
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }
            res.render("statistic/status_list", {
                incident: incident
            });
        });
    }

};