const express     = require('express')
      router      = express.Router(),
      passport    = require('passport'),
      User        = require('../models/userModel'),
      UserInfo    = require('../models/userInfoModel'),
      Ilan        = require('../models/ilanModel'),
      firebase    = require('firebase');
const Sehirler =  require('../public/sehirler.json');
let kanGruplari = ["0 Rh Pozitif","0 Rh Negatif",
                                    "A Rh Pozitif","A Rh Negatif",
                                    "B Rh Pozitif","B Rh Negatif",
                                    "AB Rh Pozitif","AB Rh Negatif"
                                  ];
global.display = 'none';
let foundsSearch = [];
router.get("/test", (req,res) => {
  firebase.database().ref('ilanlar').child('-LELnGNU-3U5mSVT_EpP')
    .once('value')
    .then((snapshot) => {
      var value = snapshot.val();
      res.send(value);
    })
    .catch((err) => {
      console.log(err);
    });

});
router.get("/", (req, res) => {
  global.display = 'none';
  res.render("home");
});
router.get("/signin", (req, res) => {
  res.render("signin");
});
router.post("/signin",(req,res) => {
    global.display = 'block';
    firebase.auth().signInWithEmailAndPassword(req.body.username , req.body.password)
      .then(() => {
            res.redirect("/");
      })
      .catch((err) =>{
        console.log(err.message);
        res.redirect('/signin');
      })});
router.get("/signup", (req,res)=> {
   res.render("signup",{kanGruplari: kanGruplari, sehirler: Sehirler });
});
router.post("/signup", (req,res)=> {
    let check = 'false';
    if (req.body.check) {
          check = 'true';
    }
    let newUserInfo = {
                                    nameSurname: req.body.name+" "+req.body.surname,
                                    mail: req.body.mail,
                                    phoneNumber: req.body.phoneNumber,
                                    kanGrubu: req.body.kanGrubu,
                                    adres: req.body.caddesokak+" "+req.body.mahalle,
                                    ilce: req.body.ilce,
                                    il: Sehirler[req.body.il-1].il,
                                    visibility: check
                                  };
    firebase.auth().createUserWithEmailAndPassword(req.body.mail , req.body.password)
    .then(() => {
    firebase.auth().signInWithEmailAndPassword(req.body.mail , req.body.password)
      .then(() => {
            firebase.database().ref('usersdata/'+global.currentUser.uid+'/infos').set(newUserInfo);
            res.redirect("/");
      })
      .catch((err) =>{
        console.log(err.message);
        res.redirect('/signup');
      });
   });
});
router.get("/signout", (req, res) => {
      firebase.auth().signOut();
      res.redirect("/");
});
router.get("/search", (req, res) => {
  res.render("search",{kanGruplari: kanGruplari, sehirler: Sehirler});
});
router.post("/search", (req, res) => {
      firebase.database().ref('usersdata').on('value', (snapshot) => {
            let data = [];
            let obje = {};
            let body = req.body.data;
            let result = snapshot.val();
            for (let userid in result ) {
                  let user = result[userid].infos;
                  if (user.visibility == 'true' && user.kanGrubu == body.kanGrubu) {
                    if (body.il != '' && body.ilce!= '') {
                        if ((user.il === body.il) && (user.ilce === body.ilce)) {
                          obje = {
                            _id : userid,
                            nameSurname: user.nameSurname,
                            mail: user.mail,
                            phoneNumber: user.phoneNumber,
                            kanGrubu: user.kanGrubu,
                            adres: user.adres,
                            ilce: user.ilce,
                            il: user.il
                          }
                          data.push(obje);
                        }
                    } else if (body.il != '') {
                      if (user.il == body.il) {
                          obje = {
                          _id: userid,
                          nameSurname: user.nameSurname,
                          mail: user.mail,
                          phoneNumber: user.phoneNumber,
                          kanGrubu: user.kanGrubu,
                          adres: user.adres,
                          ilce: user.ilce,
                          il: user.il
                        };
                        data.push(obje);
                      }
                    } else {
                      obje = {
                        _id: userid,
                        nameSurname: user.nameSurname,
                        mail: user.mail,
                        phoneNumber: user.phoneNumber,
                        kanGrubu: user.kanGrubu,
                        adres: user.adres,
                        ilce: user.ilce,
                        il: user.il
                      };
                      data.push(obje);

                    }
                    obje= {};
                  }
            }
            res.send(data)
      }, (err) => {
          console.log('HATA');
      });

});
router.post("/getDetail", (req,res) => {
  firebase.database().ref('usersdata/'+req.body.id).on('value', (snapshot) => {
    res.send(snapshot.val().infos);
  },((err)=> {
    console.log(err);
  }));
});
//
router.get("/kanarayanlar", (req,res) => {
    res.render('kanarayanlar',{kanGruplari: kanGruplari, sehirler: Sehirler});
});
router.post("/kanarayanlar", (req,res) => {
  let response = req.body.data;
  firebase.database().ref('usersdata').on('value', (snapshot) => {
        let data = snapshot.val();
        let result = [];
        let user = {};
        if (response == 'first') {
        for (let userid in data ) {
            nowUser = data[userid].ilanlar;
            for (let ilanid in nowUser) {
              ilan = nowUser[ilanid];
              user = {
                _id: ilanid,
                nameSurname: ilan.nameSurname,
                aciklama: ilan.aciklama,
                ilce: ilan.ilce,
                il: ilan.il,
                kanGrubu: ilan.kanGrubu,
                adres: ilan.adres
              }
                          result.push(user);
            }
            }
        } else {
          if (response.il != '' && response.ilce != '' ) {
            for (let userid in data ) {
                nowUser = data[userid].ilanlar;
                for (let ilanid in nowUser) {
                  ilan = nowUser[ilanid];
                  if ((ilan.il == response.il) && (ilan.ilce == response.ilce) && (ilan.kanGrubu == response.kanGrubu)) {

                    user = {
                      _id: ilanid,
                      nameSurname: ilan.nameSurname,
                      aciklama: ilan.aciklama,
                      ilce: ilan.ilce,
                      il: ilan.il,
                      kanGrubu: ilan.kanGrubu,
                      adres: ilan.adres
                    }
                    result.push(user);
                  }
                }
                }
          } else if (response.il != '') {
            for (let userid in data ) {
                nowUser = data[userid].ilanlar;
                for (let ilanid in nowUser) {
                  ilan = nowUser[ilanid];
                  if (ilan.il == response.il && ilan.kanGrubu == response.kanGrubu) {
                    user = {
                      _id: ilanid,
                      nameSurname: ilan.nameSurname,
                      aciklama: ilan.aciklama,
                      ilce: ilan.ilce,
                      il: ilan.il,
                      kanGrubu: ilan.kanGrubu,
                      adres: ilan.adres
                    }
                    result.push(user);
                  }
                }
                }
          } else {
            for (let userid in data ) {
                nowUser = data[userid].ilanlar;
                for (let ilanid in nowUser) {
                  ilan = nowUser[ilanid];
                  if (ilan.kanGrubu == response.kanGrubu) {
                    user = {
                      _id: ilanid,
                      nameSurname: ilan.nameSurname,
                      aciklama: ilan.aciklama,
                      ilce: ilan.ilce,
                      il: ilan.il,
                      kanGrubu: ilan.kanGrubu,
                      adres: ilan.adres
                    }
                    result.push(user);
                  }
                }
                }
          }
        }
        res.send(result);
  },((err)=> {
    console.log(err);
  }));
});
router.post("/ilangetir", (req,res) => {
  let id = req.body.id;
  firebase.database().ref('usersdata').on('value', (snapshot) => {
        data = snapshot.val();
        let user = {};
        loop:
        for (let userid in data ) {
            nowUser = data[userid].ilanlar;
            for (let ilanid in nowUser) {
              ilan = nowUser[ilanid];
              if (ilanid == id) {
                user = {
                  _id: ilanid,
                  nameSurname: ilan.nameSurname,
                  aciklama: ilan.aciklama,
                  ilce: ilan.ilce,
                  il: ilan.il,
                  kanGrubu: ilan.kanGrubu,
                  adres: ilan.adres,
                  mail: ilan.mail,
                  phoneNumber: ilan.phoneNumber
                }
                break loop;
              }
            }
          }
        res.send(user);
  },((err)=> {
    console.log(err);
  }));
});

module.exports = router;
