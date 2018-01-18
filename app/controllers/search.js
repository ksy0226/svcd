'use strict';

const mongoose = require('mongoose');
const async = require('async');
const CompanyModel = require('../models/Company');
const IncidentModel = require('../models/Incident');
const HigherProcessModel = require('../models/HigherProcess');
const LowerProcessModel = require('../models/LowerProcess');
const CompanyProcessModel = require('../models/CompanyProcess');
const OftenQnaModel = require('../models/OftenQna');
const service = require('../services/incident');
const service2 = require('../services/oftenqna');
const logger = require('log4js').getLogger('app');
const Iconv = require('iconv-lite');
var path = require('path');
var CONFIG = require('../../config/config.json');
var MyProcess = require('../models/MyProcess');

module.exports = {

    /**
     * 사용자별 리스트 > 상위업무 가져오기
     */

    user_list: (req, res, next) => {
        try {

            var condition = {}; //조건
            condition.company_cd = req.session.company_cd; //회사코드
            //condition.email         = req.session.email; //이메일

            //logger.debug("==========================================");
            //logger.debug("condition : ", condition);
            //logger.debug("==========================================");

            CompanyProcessModel.find(condition, function (err, myProcess) {
                if (err) {
                    res.json({
                        success: false,
                        message: err
                    });
                } else {

                    //logger.debug("==========================================");
                    ////logger.debug("myProcess : ",JSON.stringify(myProcess));
                    //console.log("myProcess : ",JSON.stringify(myProcess));
                    //logger.debug("===========================================");

                    res.render("search/user_list", {
                        myProcess: myProcess
                    });
                }
            });

        } catch (e) {
            logger.error("myProcess controllers getMyProcess : ", e);
        } finally {}

    },


    /**
     * 사용자별 상세조회 > Incident 가져오기
     */
    user_detail: (req, res, next) => {
        //logger.debug("Trace user_detail : ", req.params.id);
        try {
            IncidentModel.findById({
                _id: req.params.id
            }, function (err, incident) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                } else {
                    //완료요청일, 등록일, 접수일, 완료예정일, 완료일
                    if (incident.request_complete_date != '') incident.request_complete_date = incident.request_complete_date.substring(0, 10);
                    if (incident.register_date != '') incident.register_date = incident.register_date.substring(0, 10);
                    if (incident.receipt_date != '') incident.receipt_date = incident.receipt_date.substring(0, 10);
                    if (incident.complete_reserve_date != '') incident.complete_reserve_date = incident.complete_reserve_date.substring(0, 10);
                    if (incident.complete_date != '') incident.complete_date = incident.complete_date.substring(0, 10);
                    //incident.complete_date = new Date(incident.complete_date).toISOString().replace(/T/, ' ').replace(/\..+/, '');

                    res.render("search/user_detail", {
                        incident: incident
                    });
                }
            });
        } catch (e) {
            //logger.debug(e);
            res.render("http/500", {
                err: err
            });
        }
    },

    /**
     * 사용자 자주묻는 질문과 답
     */
    user_qna: (req, res, next) => {
        async.waterfall([function (callback) {
            HigherProcessModel.find({}, function (err, higherprocess) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                }
                callback(null, higherprocess)
            });
        }], function (err, higherprocess) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
                res.render("search/user_qna", {
                    higherprocess: higherprocess
                });
            }
        });
    },

    /**
     * 자주묻는 질문과 답 상세조회 > OfteQna 가져오기
     */
    qna_detail: (req, res, next) => {

        //logger.debug("Trace qna_detail : ", req.params.id);

        try {
            OftenQnaModel.findById({
                _id: req.params.id
            }, function (err, oftenqna) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    });
                } else {
                    //path 길이 잘라내기
                    if (oftenqna.attach_file.length > 0) {
                        for (var i = 0; i < oftenqna.attach_file.length; i++) {
                            var path = oftenqna.attach_file[i].path
                            oftenqna.attach_file[i].path = path.substring(path.indexOf(CONFIG.fileUpload.directory) + CONFIG.fileUpload.directory.length + 1);
                            if (oftenqna.attach_file[i].mimetype != null && oftenqna.attach_file[i].mimetype.indexOf('image') > -1) {
                                oftenqna.attach_file[i].mimetype = 'image';
                            }
                        }
                    }
                    res.json(oftenqna);
                }
            });
        } catch (e) {
            //logger.debug('****************', e);
        }
    },

    /**
     * 전체 조회(관리자용)
     */
    mng_list: (req, res, next) => {

        try{            
            //업무관리자(팀장)
            if (req.session.user_flag == "3") {
                
                var cdt = {};
                cdt.dept_cd = req.session.dept_cd; //업무관리자는 해당 부서만 조회
                //cdt.dept_cd = "ISU_STISU_ST005";
                
                /** MyProcess, HigherProcessModel 모델구분 */
                MyProcess.find(cdt).distinct('higher_cd').exec(function (err, myHigherProcess) {
                    if (err) {
                        res.render("http/500", {
                            err: err
                        });
                    } else {
                        
                        //logger.debug("=============================================");
                        //logger.debug("search.mng_list higherprocess ", JSON.stringify(myHigherProcess));
                        //logger.debug("=============================================");

                        var condition = {};
                        condition.higher_cd = {
                            "$in": myHigherProcess
                        }

                        HigherProcessModel.find(condition, function (err, higherprocess) {
                            if (err) {
                                res.render("http/500", {
                                    err: err
                                });
                            } else {

                                //logger.debug("=============================================");
                                //logger.debug("search.mng_list higherprocess ", JSON.stringify(higherprocess));
                                //logger.debug("=============================================");
        
                                res.render("search/mng_list", {
                                    higherprocess: higherprocess
                                });
        
                            }
                        });
                    }
                });


            //업무담당자일때만 나의 상위 업무만 조회
            }else if (req.session.user_flag == "4") {

                var cdt = {};
                cdt.email = req.session.email; //업무담당자는 본인 업무만 조회
                
                /** MyProcess, HigherProcessModel 모델구분 */
                MyProcess.find(cdt).distinct('higher_cd').exec(function (err, myHigherProcess) {
                    if (err) {
                        res.render("http/500", {
                            err: err
                        });
                    } else {
                        
                        //logger.debug("=============================================");
                        //logger.debug("search.mng_list higherprocess ", JSON.stringify(myHigherProcess));
                        //logger.debug("=============================================");

                        var condition = {};
                        condition.higher_cd = {
                            "$in": myHigherProcess
                        }

                        HigherProcessModel.find(condition, function (err, higherprocess) {
                            if (err) {
                                res.render("http/500", {
                                    err: err
                                });
                            } else {

                                //logger.debug("=============================================");
                                //logger.debug("search.mng_list higherprocess ", JSON.stringify(higherprocess));
                                //logger.debug("=============================================");
        
                                res.render("search/mng_list", {
                                    higherprocess: higherprocess
                                });
        
                            }
                        });
                    }
                });

            } else if (req.session.user_flag == "5") {
                
                var condition = {};
                condition.company_cd = req.session.company_cd; //고객사관리자는 해당회사만 조회

                /** MyProcess, HigherProcessModel 모델구분 */
                CompanyProcessModel.find(condition, function (err, higherprocess) {
                    if (err) {

                        logger.error("=============================================");
                        logger.error("search.mng_list err : user_flag == 5 ");
                        logger.error("=============================================");

                        res.render("http/500", {
                            err: err
                        });

                    } else {

                        res.render("search/mng_list", {
                            higherprocess: higherprocess
                        });

                    }
                });

            }else{ //일반사용자에게는 권한이 없고 그룹관리자

                 /** MyProcess, HigherProcessModel 모델구분 */
                 HigherProcessModel.find({}, function (err, higherprocess) {
                    if (err) {

                        logger.error("=============================================");
                        logger.error("search.mng_list err : not equals 3,4,5 ");
                        logger.error("=============================================");

                        res.render("http/500", {
                            err: err
                        });

                    } else {

                        res.render("search/mng_list", {
                            higherprocess: higherprocess
                        });

                    }
                });
                
            }
        }catch(e){

            logger.error("=============================================");
            logger.error("search.mng_list err : ", e);
            logger.error("=============================================");

        }finally{}

    },
    /**
     * 사용자별 상세조회 > Incident 가져오기
     */
    mng_detail: (req, res, next) => {

        //logger.debug("Trace mng_detail : ", req.params.id);
        IncidentModel.findById({
            _id: req.params.id
        }, function (err, incident) {
            if (err) {
                return res.json({
                    success: false,
                    message: err
                });
            } else {

                //path 길이 잘라내기
                if (incident.attach_file.length > 0) {
                    for (var i = 0; i < incident.attach_file.length; i++) {
                        var path = incident.attach_file[i].path
                        incident.attach_file[i].path = path.substring(path.indexOf(CONFIG.fileUpload.directory) + CONFIG.fileUpload.directory.length + 1);
                        if (incident.attach_file[i].mimetype.indexOf('image') > -1) {
                            incident.attach_file[i].mimetype = 'image';
                        }
                    }
                }



                //완료요청일, 등록일, 접수일, 완료예정일, 완료일
                //if(incident.request_complete_date != '') incident.request_complete_date = incident.request_complete_date.substring(0,10);
                //if(incident.register_date != '') incident.register_date = incident.register_date.substring(0,10);
                //if(incident.receipt_date != '') incident.receipt_date = incident.receipt_date.substring(0,10);
                //if(incident.complete_reserve_date != '') incident.complete_reserve_date = incident.complete_reserve_date.substring(0,10);
                //if(incident.complete_date != '') incident.complete_date = incident.complete_date.substring(0,10);
                //incident.complete_date = new Date(incident.complete_date).toISOString().replace(/T/, ' ').replace(/\..+/, '');



                res.render("search/mng_detail", {
                    incident: incident
                });
            }
        });
    },

    /** 
     * incident 첨부파일 다운로드
     */
    download: (req, res, next) => {
        var filepath = path.join(__dirname, '../../', CONFIG.fileUpload.directory, req.params.path1, req.params.path2);
        res.download(filepath);
    },

    /**
     * 연도별 미처리 리스트
     */
    remain_list: (req, res, next) => {
        async.waterfall([function (callback) {
            HigherProcessModel.find({}, function (err, higherprocess) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                }
                callback(null, higherprocess)
            });
        }], function (err, higherprocess) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
                res.render("search/remain_list", {
                    higherprocess: higherprocess
                });
            }
        });
    },

    /**
     * 진행 상태별 인시던트 조회
     */
    status_list: (req, res, next) => {

        IncidentModel.find(req.body.incident, function (err, incident) {
            ////logger.debug('err', err, '\n');
            //logger.debug('list 호출');
            if (err) {
                res.render("http/500", {
                    err: err
                });
            }
            res.render("search/status_list", {
                incident: incident
            });
        });
    },
    /**
     * 상위업무 리스트 조회
     */
    gethigherprocess: (req, res, next) => {
        //logger.debug(1);

        var condition = {};
        if (req.query.company_cd != null) {
            condition.company_cd = req.query.company_cd;
        }

        CompanyProcessModel.find(condition, function (err, higherprocess) {
            //logger.debug('lowerprocess.lower_nm', req.body.lowerprocess);
            if (err) return res.json({
                success: false,
                message: err
            });
            res.json(higherprocess);
        });
    },

    /**
     * 하위업무 리스트 조회
     */
    getlowerprocess: (req, res, next) => {
        //logger.debug(1);
        
        var condition = {};
        if (req.query.higher_cd != null) {
            condition.higher_cd = req.query.higher_cd;
        }

        HigherProcessModel.find(condition, function (err, lowerprocess) {
            //logger.debug('lowerprocess.lower_nm', req.body.lowerprocess);
            if (err) return res.json({
                success: false,
                message: err
            });
            res.json(lowerprocess);
        });
    },

    /**
     * user_list 데이터 조회
     */
    list: (req, res, next) => {

        var search = service.createSearch(req);

        var page = 1;
        var perPage = 15;
        var condition = {};

        if (req.query.page != null && req.query.page != '') page = Number(req.query.page);
        if (req.query.perPage != null && req.query.perPage != '') perPage = Number(req.query.perPage);

        if(req.query.user  != 'managerall'){
            if (search.findIncident.$and == null) {
                
                search.findIncident.$and = [{
                    "request_id": req.session.email
                }];
            
            } else {
            
                search.findIncident.$and.push({
                    "request_id": req.session.email
                });
            }
        }
        //logger.debug("===============search control================");
        //logger.debug("page : ", page);
        //logger.debug("perPage : ", perPage);
        //logger.debug("search.findIncident : ", JSON.stringify(search.findIncident));
        //logger.debug("=============================================");

        try {

            async.waterfall([function (callback) {

                    //상위업무가 전체이고, SD 담당자일때만 나의 상위 업무만 조회
                    if (req.query.higher_cd == "*" && req.session.user_flag == "4") {

                        
                        condition.email = req.session.email;

                        MyProcess.find(condition).distinct('higher_cd').exec(function (err, myHigherProcess) {

                            if (search.findIncident.$and == null) {

                                //logger.debug("=============================================");
                                //logger.debug("search.findIncident.$and is null : ", myHigherProcess);
                                //logger.debug("=============================================");

                                search.findIncident.$and = [{
                                    "higher_cd": {
                                        "$in": myHigherProcess
                                    }
                                }];
                                //{"$and":[{"higher_cd":{"$in":["H004","H006","H012","H024","H001"]}}]}
                            } else {

                                //logger.debug("=============================================");
                                //logger.debug("search.findIncident.$and is not null : ", myHigherProcess);
                                //logger.debug("=============================================");

                                search.findIncident.$and.push({
                                    "higher_cd": {
                                        "$in": myHigherProcess
                                    }
                                });
                                //'$and': [ { lower_cd: 'L004' } ] }
                            }

                            //logger.debug("getIncident =============================================");
                            //logger.debug("page : ", page);
                            //logger.debug("perPage : ", perPage);
                            //logger.debug("req.query.perPage : ", req.query.perPage);
                            //logger.debug("search.findIncident : ", search.findIncident);
                            //logger.debug("getIncident =============================================");

                            callback(null);
                        });
                    } else {
                        callback(null);
                    }

                },
                function (callback) {
                    IncidentModel.count(search.findIncident, function (err, totalCnt) {
                        if (err) {
                            logger.error("incident : ", err);

                            return res.json({
                                success: false,
                                message: err
                            });
                        } else {

                            ////logger.debug("=============================================");
                            ////logger.debug("incidentCnt : ", totalCnt);
                            ////logger.debug("=============================================");

                            callback(null, totalCnt)
                        }
                    });
                }
            ], function (err, totalCnt) {

                IncidentModel.find(search.findIncident, function (err, incident) {
                        if (err) {

                            //logger.debug("=============================================");
                            //logger.debug("incident : ", err);
                            //logger.debug("=============================================");

                            return res.json({
                                success: false,
                                message: err
                            });
                        } else {

                            //incident에 페이징 처리를 위한 전체 갯수전달
                            var rtnData = {};
                            rtnData.incident = incident;
                            rtnData.totalCnt = totalCnt

                            //logger.debug("=============================================");
                            //logger.debug("rtnData.totalCnt : ", rtnData.totalCnt);
                            //logger.debug("rtnData : ", JSON.stringify(rtnData));
                            //logger.debug("=============================================");

                            res.json(rtnData);

                        }
                    })
                    .sort('-register_date')
                    .skip((page - 1) * perPage)
                    .limit(perPage);
            });
        } catch (err) {

            //logger.debug("===============search control================");
            //logger.debug("search list error : ", err);
            //logger.debug("=============================================");

        } finally {}
    },
    /**
     * user_qna 데이터 조회
     */
    getqnalist: (req, res, next) => {
        var search2 = service2.createSearch(req);

        //logger.debug("=====================> " + JSON.stringify(search2));
        //console.log("search"+ JSON.stringify(search));

        try {
            async.waterfall([function (callback) {
                OftenQnaModel.find(search2.findOftenqna, function (err, oftenqna) {
                    if (err) {
                        res.render("http/500", {
                            err: err
                        });
                    } else {
                        callback(null, oftenqna)
                    }
                }).sort("-" + search2.order_by);
            }], function (err, oftenqna) {
                if (err) {
                    res.render("http/500", {
                        err: err
                    });
                } else {
                    res.send(oftenqna);
                }
            });
        } catch (e) {
            //logger.debug('oftenqna controllers error ====================> ', e)
        }
    }

};