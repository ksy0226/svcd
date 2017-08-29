'use strict';
const logger = require('log4js').getLogger('app');
module.exports = {

    sessionCheck: (req, res, next) => {
        var minute = 60 * 1000;
        console.log('sessionCheck '+req.session.email);
        console.log('req.session.userFlag : '+ req.session.userFlag);
        console.log('req.session.groupFlag : '+ req.session.groupFlag);                
        if (req.session.email) {
            logger.debug('sessionCheck succeed');
            userFlag = req.session.userFlag;
            groupFlag = req.session.groupFlag;
            //res.render('main/main');
            next();
        } else { //세션값이 없으면
            logger.debug('sessionCheck failed');
            //next(); //임시로 통과
            
            var email = req.cookies.email;
            var remember_me = req.cookies.remember_me;
            var userFlag = req.cookies.userFlag;
            var groupFlag = req.cookies.groupFlag;

            if (email == null) email = "";
            res.render('index', {
                email: email,
                remember_me: remember_me,
                userFlag : userFlag,
                groupFlag : groupFlag
            });
            
        }
    }
}