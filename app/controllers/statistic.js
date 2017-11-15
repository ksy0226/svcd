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
                        higher_cd : "$higher_cd"
                        ,higher_nm : "$higher_nm"
                        ,lower_cd : "$lower_cd"
                        ,lower_nm : "$lower_nm"
                        
                    }
                    ,count: {
                        $sum: 1
                    }
                }
            } 
              
        ]
        //logger.debug('aggregatorOpts'+aggregatorOpts);
        IncidentModel.aggregate(aggregatorOpts)
            .exec(function (err, incident) {
                logger.debug("incident"+JSON.stringify(incident));
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                } else {
                    logger.debug("===========", incident);
                    //res.json(result);
                    incident: incident
                }
    
                res.render("statistic/high_lower", {
                    incident: incident
                });
            });
    },
    cntload : (req, res, next) => {
        var aggregatorOpts = 
        [
            { 
                $match : { //조건
                            manager_company_cd : "ISU_ST"  //각 사별 관리담당자는?
                            //,manager_sabun : "12001"     //req.session.sabun 넣을 예정
                            ,$or: [ { status_cd : "1" }, { status_cd : "2" }, { status_cd : "3" }, { status_cd : "4" }]

                            ,register_date : {$gte: "2017-10-01T00:00:00.0Z", $lt: "2017-11-31T00:00:00.0Z"}
                            //$ifNull: [ "$person.age", "null" ]
                         }
            }
            ,{ 
                $group : { //그룹칼럼
                    _id: {
                        status_cd : "$status_cd"
                        //status_cd: { $ifNull: [ '$status_cd', [{ count: 0 }] ] }
                    }
                    ,count: {
                        $sum : 1
                        //$sum : { $ifNull: [ $sum, 0 ] }
                        //$sum :{ $ifNull: [ "$count", 1] }
                    }
                }
            }
            , {
                $sort : {
                    status_cd: -1
                }
            }
        ]
        
        IncidentModel.aggregate(aggregatorOpts).exec(function (err, incident) {
        //IncidentModel.count({status_cd: '4', manager_company_cd : "ISU_ST", manager_sabun : "14002"}, function (err, incident) {
            console.log("incident"+JSON.stringify(incident));
            console.log("length"+incident.length); 
                
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
                logger.debug("===========", incident);
                incident: incident
            }
            res.json(incident);
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