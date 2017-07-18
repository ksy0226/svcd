'use strict';

module.exports = {

  sessionCheck: (req, res, next) => {
    var minute = 60 * 1000;

    if (req.session.username) {
      res.render('index');

    } else { //세션값이 없으면

      var username = req.cookies.username;
      var idsave = req.cookies.idsavecheck;

      if (username == null) username = "";
      res.render('index', {
        nameCookie: username,
        saveCookie: idsave
      });
    }
  }
}
