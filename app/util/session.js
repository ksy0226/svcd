'use strict';
const logger = require('log4js').getLogger('app');
module.exports = {

    sessionCheck: (req, res, next) => {
        var minute = 60 * 1000;
        logger.debug('session.js sessionCheck email'+req.session.email);
        logger.debug('session.js req.session.user_flag : '+ req.session.user_flag);
        logger.debug('session.js req.session.group_flag : '+ req.session.group_flag);             
        if (req.session.email) {
            logger.debug('session.js sessionCheck succeed');
            user_flag = req.session.user_flag;
            group_flag = req.session.group_flag;
            //res.render('main/main');
            next();
        } else { //세션값이 없으면
            logger.debug('session.js sessionCheck failed');
            //next(); //임시로 통과
            
            var email = req.cookies.email;
            var remember_me = req.cookies.remember_me;
            var user_flag = req.cookies.user_flag;
            var group_flag = req.cookies.group_flag;

            if (email == null) email = "";
            res.render('index', {
                email: email,
                remember_me: remember_me,
                user_flag : user_flag,
                group_flag : group_flag
            });
            
        }
    }
}