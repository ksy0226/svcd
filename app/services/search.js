'use strict';

const logger = require('log4js').getLogger('app');

module.exports = {

    getMessage: () => {
        return 'Search Page';
    },

    createSearch: (req) => {
        console.log('datepicker-rcd : ' + req.query.datepicker_rcd );
        console.log('datepicker-rcd2 : ' + req.query.datepicker_rcd2 );


        var findSearch = {},
            findUser = null,
            highlight = {};
        var searchQueries = []; 


        if (req.query.datepicker_rcd && req.query.datepicker_rcd2) {
           
            var datepicker1 = req.query.datepicker_rcd;
            var datepicker2 = req.query.datepicker_rcd2;
            

            console.log('datepicker1 : ' + datepicker1);
            console.log('datepicker2 : ' + datepicker2);


            searchQueries.push({
                register_date : datepicker1
            });
            searchQueries.push({
                register_date : datepicker2
            });

            if (searchQueries.length > 0) findSearch = {
                $gt : datepicker1,
                $lt : datepicker2
            };

        }else{
            /*
            var status_nms = "처리중";
            if(status_nms.indexOf("처리중") >= 0 ){
                incidentQueries.push({
                    status_nm:status_nms
                });
            }
            if (incidentQueries.length > 0) findIncident = {
                $or: incidentQueries
            };
            logger.debug("findIncident",findIncident);
            */
        }
        logger.debug('findSearch : ' + JSON.stringify(findSearch));
        return {
            datepicker_rcd: req.query.datepicker_rcd,
            datepicker_rcd2: req.query.datepicker_rcd2,
            findSearch: findSearch,
            highlight: highlight
        };
    }

};
