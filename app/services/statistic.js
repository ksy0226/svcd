'use strict';

const logger = require('log4js').getLogger('app');

module.exports = {

    /**
     * 상위업무별 하위업무 통계 옵션 및 그룹
     */
    high_lower: (req) => {

        var condition = {};
        var OrQueries = [];

        if (req.query.company_cd != null && req.query.company_cd != '*') {
            condition.request_company_cd = req.query.company_cd;
        }
        if (req.query.yyyy != null) {
            condition.register_yyyy = req.query.yyyy;
        }
        if (req.query.mm != null && req.query.mm != '*') {
            condition.register_mm = req.query.mm;
        }
        //[접수대기] 건 제외
        OrQueries.push({
            $or: [{
                status_cd: "2"
            }, {
                status_cd: "3"
            }, {
                status_cd: "4"
            }]
        });

        condition.$or = OrQueries;
        
        logger.debug("==========================================statistic service=========================================");
        logger.debug("condifion : ", condition);
        logger.debug("====================================================================================================");

        var aggregatorOpts = [
            {
                $match: condition
            },
            {
                $group: { //업무별 상태별 집계
                    _id: {
                        higher_cd: "$higher_cd",
                        higher_nm: "$higher_nm",
                        lower_cd: "$lower_cd",
                        lower_nm: "$lower_nm",
                        status_cd: "$status_cd",
                        status_nm: "$status_nm"
                    },
                    count: {
                        $sum: 1
                    },
                    valuationSum: {
                        $sum: "$valuation"
                    }
                }
            }
            , {
                $group: { //상태별 집계
                    _id: {
                        higher_cd: "$_id.higher_cd",
                        higher_nm: "$_id.higher_nm",
                        lower_cd: "$_id.lower_cd",
                        lower_nm: "$_id.lower_nm"
                    },
                    grp: {
                        $push: {
                            status_cd: "$_id.status_cd",
                            count: "$count"
                        }
                    },
                    valuationSum: {
                        $sum: "$valuationSum"
                    }
                }
            }
            ,{ "$sort": { "_id.higher_cd" : 1, "_id.lower_cd" : 1 } }

        ]

        logger.debug("==================================================");
        logger.debug('high_lower ', JSON.stringify(aggregatorOpts));
        logger.debug("==================================================");

        return {
            aggregatorOpts: aggregatorOpts
        };
    },


};