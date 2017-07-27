'use strict';
const logger = require('log4js').getLogger('app');
module.exports = {

    sessionCheck: (req, res, next) => {
        var minute = 60 * 1000;
        logger.debug('sessionCheck '+req.session.email);
        if (req.session.email) {
            logger.debug('sessionCheck 0');
            res.render('main/main');
        } else { //세션값이 없으면
            logger.debug('sessionCheck 1');
            var email = req.cookies.email;
            var remember_me = req.cookies.remember_me;

            if (email == null) email = "";
            res.render('index', {
                email: email,
                remember_me: remember_me
            });
        }
    }
}