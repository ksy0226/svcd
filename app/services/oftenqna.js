'use strict';

const logger = require('log4js').getLogger('app');

module.exports = {

    createSearch: (req) => {

        var findOftenqna = {},
            highlight = {};
        var AndQueries = [];
        var OrQueries = [];
        var higher_cd = req.query.higher_cd == null ? "*" : req.query.higher_cd;

        if (req.query.searchType && req.query.searchText) {
            var searchTypes = req.query.searchType.toLowerCase().split(",");
            if (searchTypes.indexOf("title") >= 0) {
                OrQueries.push({
                    title: { $regex: new RegExp(req.query.searchText, "i") }
                });
                logger.debug('OrQueries : ' + JSON.stringify(OrQueries));
                highlight.title = req.query.searchText;
            }
            if (searchTypes.indexOf("content") >= 0) {
                OrQueries.push({
                    content: { $regex: new RegExp(req.query.searchText, "i") }
                });
                logger.debug('OrQueries : ' + OrQueries);
                highlight.content = req.query.searchText;
            }
            if (OrQueries.length > 0) {
                findIncident.$or = OrQueries
            }
        }

        //상위업무가 존재하면
        if (higher_cd != '*') {
            AndQueries.push({
                higher_cd: req.query.higher_cd
            });
        }

        //AndQuery 추가
        if (AndQueries.length > 0) {
            findOftenqna.$and = AndQueries
        }

        logger.debug('searchType >>>>>>>>>>> ' + req.query.searchType);
        logger.debug('searchText >>>>>>>>>>> ' + req.query.searchText);
        logger.debug('higher_cd >>>>>>>>>>> ' + req.query.higher_cd);
        logger.debug('findOftenqna >>>>>>>>>>> ' + JSON.stringify(findOftenqna));
        logger.debug('highlight >>>>>>>>>>> ' + JSON.stringify(highlight)); 

        return {
            searchType: req.query.searchType,
            searchText: req.query.searchText,
            higher_cd: req.query.higher_cd,
            findOftenqna: findOftenqna,
            highlight: highlight
        };
    }
};
