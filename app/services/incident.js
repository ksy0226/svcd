'use strict';

const logger = require('log4js').getLogger('app');

module.exports = {

    getMessage: () => {
        return 'Incident Page';
    },

    createSearch: (req) => {
        logger.debug('searchType : ' + req.query.searchType);
        logger.debug('searchText : ' + encodeURIComponent(req.query.searchText));
        console.log('status_nm : ' + req.query.status_nm);
        console.log('searchType : ' + req.query.searchType);
        console.log('searchText : ' + encodeURIComponent(req.query.searchText));

        var findIncident = {},
            findUser = null,
            highlight = {};
        var incidentQueries = []; 


        if (req.query.searchType && req.query.searchText) {
            var searchTypes = req.query.searchType.toLowerCase().split(",");
            var status_nms = req.query.status_nm;
            
            logger.debug('searchTypes : ' + JSON.stringify(searchTypes));
            
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
            
            if(status_nms.indexOf("접수대기") >= 0 ){
                incidentQueries.push({
                    status_nm:{ $regex : new RegExp(req.query.status_nm, "i") }
                });
            }
            if(status_nms.indexOf("처리중") >= 0 ){
                incidentQueries.push({
                    status_nm:{ $regex : new RegExp(req.query.status_nm, "i") }
                });
            }
            if(status_nms.indexOf("미평가") >= 0 ){
                incidentQueries.push({
                    status_nm:{ $regex : new RegExp(req.query.status_nm, "i") }
                });
            }
            if(status_nms.indexOf("완료") >= 0 ){
                incidentQueries.push({
                    status_nm:{ $regex : new RegExp(req.query.status_nm, "i") }
                });
            }
            if(status_nms.indexOf("보류") >= 0 ){
                incidentQueries.push({
                    status_nm:{ $regex : new RegExp(req.query.status_nm, "i") }
                });
            }

            if (incidentQueries.length > 0) findIncident = {
                $or: incidentQueries
            };
        }else{
            var searchTypes = req.query.searchType.toLowerCase().split(",");
            var status_nms = req.query.status_nm;

            req.query.searchText = " ";
            req.query.searchType = "title,content"
            req.query.status_nm ="접수대기";

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

            if(status_nms.indexOf("접수대기") >= 0 ){
                incidentQueries.push({
                    status_nm:{ $regex : new RegExp(req.query.status_nm, "i") }
                });
            }
             
            if (incidentQueries.length > 0) findIncident = {
                $or: incidentQueries
            };
            
        }
        logger.debug('findIncident : ' + JSON.stringify(findIncident));
        return {
            searchType: req.query.searchType,
            searchText: req.query.searchText,
            status_nm: req.query.status_nm,
            findIncident: findIncident,
            findUser: findUser,
            highlight: highlight
        };
    }

};
