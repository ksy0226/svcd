'use strict';

const mongoose = require('mongoose');
const async = require('async');
const CompanyModel = require('../models/Company');
const service = require('../services/company');
const logger = require('log4js').getLogger('app');
const Iconv = require('iconv-lite');

module.exports = {

    index: (req, res, next) => {
        CompanyModel.find(req.body.company, function (err, company) {
            logger.debug('list 호출');
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
                res.render("company/index", {
                    company: company
                });
            }
        });
    },

    new: (req, res, next) => {
        res.render("company/new");
    },

    save: (req, res, next) => {
        var company = req.body.company;
        logger.debug('body', req.body);

        CompanyModel.create(req.body.company, function (err, company) {
            logger.debug('save 호출');
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
                res.redirect('/company');
            }
        });
    },

    edit: (req, res, next) => {
        CompanyModel.findById(req.params.id, function (err, company) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
                res.render("company/edit", {
                    company: company
                });
            }
        }).sort({
            group_flag: -1,
            company_nm: 1
        });
    },

    update: (req, res, next) => {
        CompanyModel.findOneAndUpdate({
            _id: req.params.id
        }, req.body.company, function (err, company) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
                if (!company) {
                    res.render("http/500", {
                        err: err
                    });
                } else {
                    res.redirect('/company/');
                }
            }
        });
    },

    delete: (req, res, next) => {

        CompanyModel.findOneAndRemove({
            _id: req.params.id
            //,author: req.user._id
        }, function (err, company) {
            if (err) {
                res.render("http/500", {
                    err: err
                });
            } else {
                if (!company) {
                    res.render("http/500", {
                        err: err
                    });
                } else {
                    res.redirect('/company/');
                }
            }
        });
    },

    exceldownload: (req, res, next) => {

        CompanyModel.find(req.body.company, function (err, companyJsonData) {
            if (err) {
                return res.json({
                    success: false,
                    message: err
                });
            } else {

                res.json(companyJsonData);
            }
        });
    },

    /**
     * 회사 정보 조회
     */
    getCompany: (req, res, next) => {
        try {

            logger.debug("==========================================company getCompany========================================");
            logger.debug("====================================================================================================");
            /*
                        try {
                            request({
                                //uri: "http://gw.isu.co.kr/CoviWeb/api/UserList.aspx?searchName="+encodeURIComponent(req.query.searchText),
                                uri: CONFIG.groupware.uri + "/CoviWeb/api/UserList.aspx?searchName=" + encodeURIComponent(req.query.searchText),
                                //uri: "http://gw.isu.co.kr/CoviWeb/api/UserInfo.aspx?email=hilee@isu.co.kr&password=nimda3",
                                headers: {
                                    'Content-type': 'application/json'
                                },
                                method: "GET",
                            }, function (err, response, usermanage) {

                                //logger.debug("=====================================");
                                //logger.debug("=====>userJSON group ", usermanage);
                                //logger.debug("=====================================");

                                Usermanage.find({
                                        employee_nm: {
                                            $regex: new RegExp(req.query.searchText, "i")
                                        },
                                        group_flag: "out"
                                    })
                                    .limit(10)
                                    .exec(function (err, usermanageData) {
                                        if (err) {
                                            return res.json({
                                                success: false,
                                                message: err
                                            });
                                        } else {
                                            if (usermanage != null) {
                                                usermanage = JSON.parse(usermanage);
                                            }
                                            res.json(mergeUser(usermanage, usermanageData));
                                        }
                                    }); //usermanage.find End
                            }); //request End
                        } catch (e) {
                            logger.error("===control usermanager.js userJSON : ", e);
                        }
            */

            CompanyModel.find({}, function (err, companyJsonData) {
                    if (err) {
                        return res.json({
                            success: false,
                            message: err
                        });
                    } else {

                        //logger.debug("==========================================CompanyModel.find({}========================================");
                        //logger.debug("companyJsonData : ",companyJsonData);
                        //logger.debug("====================================================================================================");

                        res.json(companyJsonData);
                    };

                })
                .sort({
                    group_flag: -1,
                    company_nm: 1
                });
        } catch (e) {
            logger.error("CompanyModel error : ", e);
        } finally {}
    },

    list: (req, res, next) => {
        var search = service.createSearch(req);

        async.waterfall([function (callback) {
            CompanyModel.find(search.findCompany, function (err, company) {
                    if (err) {
                        return res.json({
                            success: false,
                            message: err
                        });
                    } else {
                        /*
                        logger.debug("==========================================getcompany=======================================");
                        logger.debug("company : ", company);
                        logger.debug("================================================================================================");
                        */

                        callback(null, company);
                    }
                })
                .sort({
                    group_flag: -1,
                    company_nm: 1
                });
        }], function (err, company) {
            if (err) {
                return res.json({
                    success: false,
                    message: err
                });
            } else {
                /*
                logger.debug("==========================================getcompany=======================================");
                logger.debug("company list : ", JSON.stringify(company));
                logger.debug("==================================================+++===========================================");
                */

                res.send(company);
            }
        });
    },
    
    /**
     * 권한별 회사 정보 조회
     */
    getUFCompany: (req, res, next) => {
        try {

            logger.debug("==========================================company getCompany========================================");
            logger.debug("====================================================================================================");
            var condition ={};
            if(req.session.user_flag == "5"){
                condition.company_cd = req.session.company_cd;
            }
            CompanyModel.find(condition, function (err, companyJsonData) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    });
                } else {

                    logger.debug("==========================================CompanyModel.find({}========================================");
                    logger.debug("companyJsonData : ",companyJsonData);
                    logger.debug("====================================================================================================");

                    res.json(companyJsonData);
                };

            })
            .sort({
                group_flag: -1,
                company_nm: 1
            });
            
        } catch (e) {
            logger.error("CompanyModel error : ", e);
        } finally {}
    },
};