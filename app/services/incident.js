'use strict';

const logger = require('log4js').getLogger('app');

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
        var DateQueries = [];  

        if (req.query.searchType && req.query.searchText) {
            var searchTypes = req.query.searchType.toLowerCase().split(",");
            if (searchTypes.indexOf("title") >= 0) {
                OrQueries.push({
                    title: { $regex : new RegExp(req.query.searchText, "i") }
                });
                logger.debug('OrQueries : ' + JSON.stringify(OrQueries));
                highlight.title = req.query.searchText;
            }
            if (searchTypes.indexOf("content") >= 0) {
                OrQueries.push({
                    content:{ $regex : new RegExp(req.query.searchText, "i") }
                });
                logger.debug('OrQueries : ' + OrQueries);
                highlight.content = req.query.searchText;
            }   
            if (OrQueries.length > 0){
                findIncident.$or = OrQueries
            }
        }

        var higher_cd = req.query.higher_cd;
        var lower_cd = req.query.lower_cd;

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
        if (req.query.datepicker_rcd && req.query.datepicker_rcd2) {
          
            AndQueries.push({
                register_date : {"$gt":req.query.datepicker_rcd,"$lt":req.query.datepicker_rcd2}
            });
            
        }
        if (AndQueries.length > 0){
            findIncident.$and = AndQueries
        }



        /*
        //검색 시작일 존재하면
        if(datepicker_rcd != ''){
            AndQueries.push({
                datepicker_rcd : req.query.datepicker_rcd
            });
        }

        if (AndQueries.length > 0){
            findIncident.$gt = AndQueries
        }
        */

        /*
        //검색 마지막일 존재하면
        if(datepicker_rcd2 != '*'){
            AndQueries.push({
                datepicker_rcd : req.query.datepicker_rcd2
            });
        }

        if (AndQueries.length > 0){
            findIncident.$lt = AndQueries
        }
        */

        logger.debug('findIncident : ' + JSON.stringify(findIncident));
        console.log('req.query.higher_cd : ' + req.query.higher_cd);
        console.log('req.query.lower_cd : ' + req.query.lower_cd);
        console.log('req.query.datepicker_rcd : ' + req.query.datepicker_rcd);
        console.log('req.query.datepicker_rcd2 : ' + req.query.datepicker_rcd2);

        console.log('findIncident : ' + JSON.stringify(findIncident));

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


/*
'use strict';

const logger = require('log4js').getLogger('app');

module.exports = {

    getMessage: () => {
        return 'Incident Page';
    },

    createSearch: (req) => {
        logger.debug('searchType : ' + req.query.searchType);
        logger.debug('searchText : ' + encodeURIComponent(req.query.searchText));
        console.log('searchText : ' + req.query.searchText);

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
            }
            if (searchTypes.indexOf("content") >= 0) {
                OrQueries.push({
                    content:{ $regex : new RegExp(req.query.searchText, "i") }
                });
                logger.debug('OrQueries : ' + OrQueries);
                highlight.content = req.query.searchText;
            }   
            if (OrQueries.length > 0){
                findIncident.$or = OrQueries
            }
        }

        var status_cd = req.query.status_cd;
        //진행상태가 존재하면
        if(status_cd != '*'){
            AndQueries.push({
                status_cd : req.query.status_cd
            });
        }

        if (AndQueries.length > 0){
            findIncident.$and = AndQueries;
        }

        logger.debug('findIncident : ' + JSON.stringify(findIncident));
        console.log('req.query.status_cd : ' + req.query.status_cd);
        console.log('req.query.searchType : ' + req.query.searchType);
        console.log('findIncident : ' + JSON.stringify(findIncident));
        return {
            searchType: req.query.searchType,
            searchText: req.query.searchText,
            status_cd: req.query.status_cd,
            findIncident: findIncident,
            findUser: findUser,
            highlight: highlight
        };
    }

};
*/
