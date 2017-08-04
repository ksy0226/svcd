'use strict';
const logger = require('log4js').getLogger('app');
module.exports = {

    sessionCheck: (req, res, next) => {
        var minute = 60 * 1000;
        logger.debug('sessionCheck '+req.session.email);
        if (req.session.email) {
            logger.debug('sessionCheck succeed');
            //res.render('main/main');
            next();
        } else { //세션값이 없으면
            logger.debug('sessionCheck failed');
            next(); //임시로 통과
            /*
            var email = req.cookies.email;
            var remember_me = req.cookies.remember_me;

            if (email == null) email = "";
            res.render('index', {
                email: email,
                remember_me: remember_me
            });
            */
        }
    }
}