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
