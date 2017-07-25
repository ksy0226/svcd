'use strict';

module.exports = {

  sessionCheck: (req, res, next) => {
    var minute = 60 * 1000;

    if (req.session.email) {
      res.render('index');

    } else { //세션값이 없으면

      var email = req.cookies.email;
      var idsave = req.cookies.idsavecheck;

      if (email == null) email = "";
      res.render('index', {
        nameCookie: email,
        saveCookie: idsave
      });
    }
  }
}
