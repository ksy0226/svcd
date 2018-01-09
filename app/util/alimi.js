'use strict';

var mongoose = require('mongoose');
var async = require('async');
var logger = require('log4js').getLogger('app');
var MyProcess = require('../models/MyProcess');
var request = require("request");
var CONFIG = require('../../config/config.json');

module.exports = {

    /**
     * 그룹메신저 호출
     */
    sendAlimi: (higher_cd) => {

        logger.debug("=============================================");
        logger.debug("util/alimi/sendAlimi, higher_cd : ", higher_cd);
        logger.debug("=============================================")

        try{
            //>>>>> 상위업무에 매핑되는 사원찾기
            var condition = {};
            condition.higher_cd = higher_cd;

            var aggregatorOpts = [{
                $match: condition
            }, {
                $group: { //그룹
                    _id: {
                        email: "$email"
                    }
                }
            }, {
                $lookup: {
                    from: "usermanages", // join 할 collection명
                    localField: "_id.email", // 기본 키($group에서 얻은 값)
                    foreignField: "email", // 외래 키(usermanagers collection에 값) 
                    as: "manager" // 결과를 배출할 alias ( 필드명 )
                }
            }, {
                $project: {
                    "manager.company_cd": 1,
                    "manager.sabun": 1
                }
            }]

            MyProcess.aggregate(aggregatorOpts).exec(function (err, targetUser) {
                if (err) {

                    logger.error("=============================================");
                    logger.error("util/alimi/sendAlimi aggregate!!! err  ", err);
                    logger.error("=============================================");

                } else {

                    var gw = CONFIG.groupware.uri;
                    var alimi = CONFIG.msgAlimi.uri

                    for (var i = 0; i < targetUser.length; i++) {

                        //Go Live(운영 시 수정처리)
                        //var manager = targetUser[i].manager[0].company_cd + targetUser[i].manager[0].sabun;
                        var manager = "ISU_ST01004";

                        //logger.debug("=============================================");
                        //logger.debug("util/alimi/sendAlimi, manager : ", manager);
                        //logger.debug("=============================================")

                        request({
                            uri: alimi + "/alimi/call_alimi.jsp?msgtype=CSD&users_id=" + manager + "&title=1&link_url=" + gw + "/CoviWeb/Main.aspx?type=helpdesK" + manager,
                            headers: {
                                'Content-type': 'application/html'
                            },
                            method: "GET",
                        }, function (err, response, body) {
                            //todo
                        });
                    }


                }
            });
            //<<<<< 상위업무에 매핑되는 사원찾기   
        }catch(e){

            logger.error("=============================================");
            logger.error("util/alimi/sendAlimi error : ", e);
            logger.error("=============================================")

        }finally{}
    
    },

};