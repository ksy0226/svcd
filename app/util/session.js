'use strict';

module.exports = {

  sessionCheck: (req, res, next) => {
    var minute = 60 * 1000;

    //res.cookie('json', {company : 'isusystem', id : 'sunwoo'});


    /*if(req.body.idsavecheck){
    res.cookie('idsavecheck', 1, { maxAge: minute });
    console.log("req.cookies.name"+req.cookies.name);
      if(req.cookies.name)
      {

        res.cookie('name', req.session.username);
      }
    }else{
      res.cookie('name', "");
    }
    */
    /*
          if(req.body.idsavecheck){
            req.cookies.name ="";
          }else{
            req.cookies.name =req.session.username ;
          }
    */


    //세션값이 있으면,
    if (req.session.username) {
      //console.log('2');
      //res.cookies('id','sunwoo');
      res.render('index');

    } else { //세션값이 없으면
      //console.log("12121212"+req.body.idsavecheck);

      var username = req.cookies.username;
      console.log("session.js username :  " + username);
      var idsave = req.cookies.idsavecheck;
      console.log("idsave : " + idsave);
      console.log(idsave);




      if (username == null) username = "";
      res.render('index', {
        nameCookie: username,
        saveCookie: idsave
      });
    }
  }
}
