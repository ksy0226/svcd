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
                $group: { //그룹칼럼
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
                $match: { //조건
                    request_company_cd: "ISU_ST"
                    , higher_cd: "H001"
                    , $or: [{ status_cd: "2" }, { status_cd: "3" }, { status_cd: "4" }]

                }
            }


            , {
                $group: { //그룹칼럼
                    _id: {
                        //request_company_cd: "$request_company_cd"
                        higher_cd: "$higher_cd"
                        , higher_nm: "$higher_nm"
                        , lower_cd: "$lower_cd"
                        , lower_nm: "$lower_nm"

                    }
                    , count: {
                        $sum: 1
                    }
                }
            }

        ]
        //logger.debug('aggregatorOpts'+aggregatorOpts);
        IncidentModel.aggregate(aggregatorOpts)
            .exec(function (err, incident) {
                logger.debug("incident" + JSON.stringify(incident));
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

    /**
     * 메인 카운트 로드
    */
    cntload: (req, res, next) => {
        var startDate = new Date(new Date().setDate(new Date().getDate() - 60)).toISOString().replace(/T/, ' ').replace(/\..+/, '');
        var endDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

        var aggregatorOpts =
            [
                {
                    $match: { //조건
                        manager_company_cd: "ISU_ST"  //각 사별 관리담당자는?
                        //,manager_sabun : "12001"     //req.session.sabun 넣을 예정
                        , $or: [{ status_cd: "1" }, { status_cd: "2" }, { status_cd: "3" }, { status_cd: "4" }]
                        //,$and : [ { register_date : {$gte: "2017-05-19T04:49:38.881Z"}}
                        //         ,{ register_date : {$lte:"2017-11-15T04:49:38.881Z"}} ]
                        //,register_date : {$gte: "2017-10-19T04:49:38.881Z", $lte:"2017-11-15T04:49:38.881Z"}
                        //,register_date : {$gte: new Date(new Date().setDate(new Date().getDate()-180)), $lte: new Date()}
                        , register_date: { $gte: startDate, $lte: endDate }

                    }
                }
                , {
                    $group: { //그룹칼럼
                        _id: {
                            status_cd: "$status_cd"
                            //status_cd: { $ifNull: [ '$status_cd', [{ count: 0 }] ] }
                        }
                        , count: {
                            $sum: 1
                            //$sum : { $ifNull: [ $sum, 0 ] }
                            //$sum :{ $ifNull: [ "$count", 1] }
                        }

                    }
                }
                /*
                , {
                    total: { 
                        $sum: "$count"
                    } 
                }
                */
                , {
                    $sort: {
                        status_cd: -1
                    }
                }
            ]

        IncidentModel.aggregate(aggregatorOpts).exec(function (err, incident) {
            //IncidentModel.count({status_cd: '4', manager_company_cd : "ISU_ST", manager_sabun : "14002"}, function (err, incident) {
            //console.log("incident"+JSON.stringify(incident));    
            if (err) {
                return res.json({
                    success: false,
                    message: err
                });
            }

            res.json(incident);
        });
    },

    chartLoad: (req, res, next) => {
        var today = new Date();
        var thisYear = today.getFullYear();
        var preYear = thisYear - 1;

        var aggregatorOpts =
            [
                {
                    $match: { //조건
                        register_yyyy: { $gte: preYear.toString(), $lte: thisYear.toString() }
                    }
                }, {
                    $group: { //그룹
                        _id: {
                            register_yyyy: "$register_yyyy",
                            register_mm: "$register_mm"
                        }
                        , count: {
                            $sum: 1
                        }

                    }
                }, {
                    $sort: {
                        register_yyyy: -1,
                        register_mm: -1
                    }
                }
            ]

        IncidentModel.aggregate(aggregatorOpts).exec(function (err, incident) {
            //console.log("chartLoad >>>>>> " + JSON.stringify(incident));
            if (err) {
                return res.json({
                    success: false,
                    message: err
                });
            }

            res.json(incident);
        });
    },


    /**
     * 당월 처리현황 조회
    */
    monthlyload: (req, res, next) => {
        var today = new Date();
        var thisYear = today.getFullYear();

        var aggregatorOpts =
            [
                {
                    $match: { //조건
                        //manager_company_cd : "ISU_ST"  //각 사별 관리담당자는?
                        //,manager_sabun : "12001"     //req.session.sabun 넣을 예정
                        status_cd: "4"
                        , register_yyyy: "2017"
                    }
                }
                , {
                    $group: { //그룹칼럼
                        _id: {
                            //register_yyyy : "$register_yyyy"
                            register_mm: "$register_mm"
                        }
                        , count: {
                            $sum: 1
                        }
                        , avgValue: { $avg: "$valuation" }
                        //ROUND(avg(downloads),2)

                    }
                }
                , {
                    $sort: {
                        register_mm: -1
                    }
                }
            ]

        //console.log("monthlyload aggregatorOpts >> "+JSON.stringify(aggregatorOpts)+thisYear); 
        IncidentModel.aggregate(aggregatorOpts).exec(function (err, incident) {
            //IncidentModel.count({status_cd: '4', manager_company_cd : "ISU_ST", manager_sabun : "14002"}, function (err, incident) {
            //console.log("monthlyload incident >> "+JSON.stringify(incident));    
            if (err) {
                return res.json({
                    success: false,
                    message: err
                });
            }else{
                res.json(setMonthData(incident));
            }
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

function setMonthData(srcData){
    var rtnJSON = {};
    var cnt = [0,0,0,0,0,0,0,0,0,0,0,0];
    var avg = [0,0,0,0,0,0,0,0,0,0,0,0];
    //var rtnJSON = new Array(12);
    try{

        //[{"_id":{"register_mm":"11"},"count":5,"avgValue":4.6},{"_id":{"register_mm":"05"},"

        for(var i = 0 ; i < srcData.length ; i++){
            console.log(Number(srcData[i]._id.register_mm));
            var idx = Number(srcData[i]._id.register_mm);
            cnt.splice( idx , 1 , srcData[i].count);
            //avg.splice( idx , 1 , Math.round(srcData[i].avgValue,-2) );
            avg.splice( idx, 1, srcData[i].avgValue.toFixed(2));
        }

        rtnJSON = {
             cnt : cnt
            ,avg : avg
        };

        console.log(JSON.stringify(rtnJSON));

    }catch(e){
        logger.error("control useremanage mergeUser : ",e);
    }finally{
    }
    return rtnJSON;
}