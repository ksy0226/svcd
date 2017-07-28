'use strict';

const logger = require('log4js').getLogger('app');

module.exports = {

    getMessage: () => {
        return 'Usermanage Page';
    },

    createSearch: (req) => {
        logger.debug('searchType : ' + req.query.searchType);
        logger.debug('searchText : ' + encodeURIComponent(req.query.searchText));

        var findUsermanage = {},
            findUser = null,
            highlight = {};
        if (req.query.searchType && req.query.searchText) {
            var searchTypes = req.query.searchType.toLowerCase().split(",");
            logger.debug('searchTypes : ' + JSON.stringify(searchTypes));
            var usermanageQueries = [];
            if (searchTypes.indexOf("title") >= 0) {
                usermanageQueries.push({
                    title: { $regex : new RegExp(req.query.searchText, "i") }
                });
                logger.debug('usermanageQueries : ' + JSON.stringify(usermanageQueries));
                highlight.title = req.query.searchText;
            }
            if (searchTypes.indexOf("content") >= 0) {
                usermanageQueries.push({
                    content:{ $regex : new RegExp(req.query.searchText, "i") }
                });
                logger.debug('usermanageQueries : ' + usermanageQueries);
                highlight.content = req.query.searchText;
            }
            if (usermanageQueries.length > 0) findUsermanage = {
                $or: usermanageQueries
            };
        }
        logger.debug('findUsermanage : ' + JSON.stringify(findUsermanage));
        return {
            searchType: req.query.searchType,
            searchText: req.query.searchText,
            findUsermanage: findUsermanage,
            findUser: findUser,
            highlight: highlight
        };
    }

};
