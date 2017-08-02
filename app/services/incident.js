'use strict';

const logger = require('log4js').getLogger('app');

module.exports = {

    getMessage: () => {
        return 'Incident Page';
    },

    createSearch: (req) => {
        logger.debug('searchType : ' + req.query.searchType);
        logger.debug('searchText : ' + encodeURIComponent(req.query.searchText));

        var findIncident = {},
            findUser = null,
            highlight = {};
        if (req.query.searchType && req.query.searchText) {
            var searchTypes = req.query.searchType.toLowerCase().split(",");
            logger.debug('searchTypes : ' + JSON.stringify(searchTypes));
            var incidentQueries = [];
            if (searchTypes.indexOf("title") >= 0) {
                incidentQueries.push({
                    title: { $regex : new RegExp(req.query.searchText, "i") }
                });
                logger.debug('incidentQueries : ' + JSON.stringify(incidentQueries));
                highlight.title = req.query.searchText;
            }
            if (searchTypes.indexOf("content") >= 0) {
                incidentQueries.push({
                    content:{ $regex : new RegExp(req.query.searchText, "i") }
                });
                logger.debug('incidentQueries : ' + incidentQueries);
                highlight.content = req.query.searchText;
            }
            if (incidentQueries.length > 0) findIncident = {
                $or: incidentQueries
            };
        }
        logger.debug('findIncident : ' + JSON.stringify(findIncident));
        return {
            searchType: req.query.searchType,
            searchText: req.query.searchText,
            findIncident: findIncident,
            findUser: findUser,
            highlight: highlight
        };
    }

};
