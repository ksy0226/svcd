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

        var higher_nm = req.query.higher_nm;
        var lower_nm = req.query.lower_nm;

        //상위업무가 존재하면
        if(higher_nm != '*'){
            AndQueries.push({
                higher_nm : req.query.higher_nm
            });
        }

        //하위업무가 존재하면
        if(lower_nm != '*'){
            AndQueries.push({
                lower_nm : req.query.lower_nm
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
        console.log('req.query.higher_nm : ' + req.query.higher_nm);
        console.log('req.query.lower_nm : ' + req.query.lower_nm);
        console.log('req.query.datepicker_rcd : ' + req.query.datepicker_rcd);
        console.log('req.query.datepicker_rcd2 : ' + req.query.datepicker_rcd2);

        console.log('findIncident : ' + JSON.stringify(findIncident));

        return {
            searchType: req.query.searchType,
            searchText: req.query.searchText,
            higher_nm: req.query.higher_nm,
            lower_nm: req.query.lower_nm,
            findIncident: findIncident,
            highlight: highlight
        };
    }

};
