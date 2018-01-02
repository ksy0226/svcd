'use strict';

var MyProcess = require('../models/MyProcess');
var logger = require('log4js').getLogger('app');

module.exports = {

    getMessage: () => {
        return 'Search Page';
    },

    createSearch: (req) => {

        var findIncident = {},
            findUser = null,
            highlight = {};
        var AndQueries = []; 
        var OrQueries = [];

        if (req.query.searchType && req.query.searchText) {
            var searchTypes = req.query.searchType.toLowerCase().split(",");
            if (searchTypes.indexOf("title") >= 0) {
                OrQueries.push({
                    title: { $regex : new RegExp(req.query.searchText, "i") }
                });
                logger.debug('OrQueries : ' + JSON.stringify(OrQueries));
                highlight.title = req.query.searchText;
            }else if (searchTypes.indexOf("content") >= 0) {
                OrQueries.push({
                    content:{ $regex : new RegExp(req.query.searchText, "i") }
                });
                logger.debug('OrQueries : ' + OrQueries);
                highlight.content = req.query.searchText;
            }else if (searchTypes.indexOf("title,content") >= 0) {
                OrQueries.push({
                    title: { $regex : new RegExp(req.query.searchText, "i") },
                    content:{ $regex : new RegExp(req.query.searchText, "i") }
                });
                logger.debug('OrQueries : ' + OrQueries);
                highlight.content = req.query.searchText;
            }
            
            if (OrQueries.length > 0){
                findIncident.$or = OrQueries
            }
        }

        var higher_cd = req.query.higher_cd == null ? "*" : req.query.higher_cd ;
        var lower_cd = req.query.lower_cd == null ? "*" : req.query.lower_cd ;
        var status_cd = req.query.status_cd == null ? "*" : req.query.status_cd ;
        var reg_date_from = req.query.reg_date_from;
        var reg_date_to = req.query.reg_date_to;
              
        //진행상태가 존재하면
        if(status_cd != '*'){
            AndQueries.push({
                status_cd : req.query.status_cd
            });
        }

        //처리된 내용검색 gbn 구분 추가
        //gbn=complete 시, status=3,4만 가져오기
        if(req.query.gbn == "complete"){
            AndQueries.push({
                $or: [{
                    "status_cd" : "3"
                }, {
                    "status_cd" : "4"
                }]
            });
        }
        //추가 끝

        //상위업무가 존재하면
        if(higher_cd != '*'){
            AndQueries.push({
                higher_cd : req.query.higher_cd
            });
        }

        //하위업무가 존재하면
        if(lower_cd != '*'){
            AndQueries.push({
                lower_cd : req.query.lower_cd
            });
        }
        
        if (AndQueries.length > 0){
            findIncident.$and = AndQueries
        }
        
        //검색기간 조건 추가
        if (reg_date_from && reg_date_to) {    
            AndQueries.push({
                register_date : {"$gt":reg_date_from,"$lt":reg_date_to}
            });
        }


        //나의 업무처리현황
        if(req.query.user == "manager"){
     
            var condition ={};
            condition.email = req.session.email; //나의 상위업무조회
    
            MyProcess.find(condition).distinct('higher_cd').exec(function(err, myprocess){

                logger.debug("=============================================");
                logger.debug("myprocess1 : ", myprocess);
                logger.debug("=============================================");
                
                AndQueries.push({
                    "higher_cd" : {"$or" : myprocess}
                });

                /**
                 * AndQuery 추가
                 */
                if (AndQueries.length > 0){
                    findIncident.$and = AndQueries
                }

                logger.debug("=============================================");
                logger.debug("AndQueries : ", JSON.stringify(AndQueries));
                logger.debug("=============================================");
    
                logger.debug('findIncident : ' + JSON.stringify(findIncident));
                logger.debug('req.query.higher_cd : ' + req.query.higher_cd);
                logger.debug('req.query.lower_cd : ' + req.query.lower_cd);
                logger.debug('req.query.searchType : ' + req.query.searchType);
                logger.debug('req.query.searchText : ' + req.query.searchText);
                logger.debug('req.query.reg_date_from : ' + req.query.reg_date_from);
                logger.debug('req.query.reg_date_to : ' + req.query.reg_date_to);
        
                //console.log('findIncident : ' + JSON.stringify(findIncident));
        
                return {
                    searchType: req.query.searchType,
                    searchText: req.query.searchText,
                    higher_cd: req.query.higher_cd,
                    lower_cd: req.query.lower_cd,
                    findIncident: findIncident,
                    highlight: highlight
                };

            });
    
           


        //전체내용검색
        }else if(req.query.user == "managerall"){

        }else{
            AndQueries.push({
                request_id : req.session.email
            });
        }

        logger.debug('findIncident : ' + JSON.stringify(findIncident));
        logger.debug('req.query.higher_cd : ' + req.query.higher_cd);
        logger.debug('req.query.lower_cd : ' + req.query.lower_cd);
        logger.debug('req.query.searchType : ' + req.query.searchType);
        logger.debug('req.query.searchText : ' + req.query.searchText);
        logger.debug('req.query.reg_date_from : ' + req.query.reg_date_from);
        logger.debug('req.query.reg_date_to : ' + req.query.reg_date_to);

        //console.log('findIncident : ' + JSON.stringify(findIncident));

        return {
            searchType: req.query.searchType,
            searchText: req.query.searchText,
            higher_cd: req.query.higher_cd,
            lower_cd: req.query.lower_cd,
            findIncident: findIncident,
            highlight: highlight
        };
    }

};