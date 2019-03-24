const express     = require('express')
      router      = express.Router(),
      User        = require('../models/userModel'),
      UserInfo    = require('../models/userInfoModel'),
      Ilan        = require('../models/ilanModel');
const Sehirler =  require('../public/sehirler.json');

let kanGruplari = ["0 Rh Pozitif","0 Rh Negatif",
                                    "A Rh Pozitif","A Rh Negatif",
                                    "B Rh Pozitif","B Rh Negatif",
                                    "AB Rh Pozitif","AB Rh Negatif"
                                  ];

router.all("/profile", isLoggedIn, (req,res) => {
    res.render("profile",{kanGruplari: kanGruplari, sehirler: Sehirler});
});
router.post("/accountremove", isLoggedIn, (req,res) => {
  var user = firebase.auth().currentUser;
  user.delete().then(function() {
    firebase.database().ref('usersdata/'+user.uid).remove()
      .then(() => {
        res.redirect('/');
      })
}).catch(function(error) {
        res.send(error);
});
});
router.all("/ilanlarim", isLoggedIn, (req, res) => {
    firebase.database().ref('usersdata/'+global.currentUser.uid+'/infos').once('value')
      .then((user) => {
        let kullanici = {
                    adSoyad: user.nameSurname,
                    telefon: user.phoneNumber,
                    mail: user.mail,
                    ilce: user.ilce,
                     il: user.il,
                    kanGrubu: user.kanGrubu
                  };

                res.render("ilanlarim",{kanGruplari:kanGruplari, kullanici: kullanici, sehirler: Sehirler});
      })


});

router.post("/ilanlistele",isLoggedIn,(req,res) => {
  firebase.database().ref('usersdata/'+global.currentUser.uid+'/ilanlar').once('value')
  .then((results) => {
    var test = results.val();
    res.send(test);
  })
});
router.post("/vericek", isLoggedIn ,(req,res) => {
  firebase.database().ref('usersdata/'+global.currentUser.uid+'/ilanlar/'+req.body.id).once('value')
  .then((results) => {
    var test = results.val();
    res.send(test);
  })
});
router.post("/profileinfo", isLoggedIn ,(req,res) => {
  firebase.database().ref('usersdata/'+global.currentUser.uid+'/infos').once('value')
    .then((user) => {
      res.send(user);
    })
});
router.post("/duzenle",isLoggedIn,(req,res) => {
  firebase.database().ref('usersdata/'+global.currentUser.uid+'/ilanlar/'+req.body.id).update(
    {
      phoneNumber: req.body.phoneNumber,
      kanGrubu: req.body.kanGrubu,
      il: Sehirler[req.body.il-1].il,
      ilce: req.body.ilce,
      aciklama: req.body.aciklama
    }
  )
  .then(() => {
    res.send('success');
  })
  .catch((err) => {
    console.log('err');
  })
});
router.post("/sil",isLoggedIn,(req,res) => {
  firebase.database().ref('usersdata/'+global.currentUser.uid+'/ilanlar/'+req.body.id).remove()
  .then(() => {
    res.send('success');
  })
  .catch((err) => {
    console.log('err');
  })
});
router.post("/ilanEkle", isLoggedIn, (req,res) => {
  firebase.database().ref('usersdata/'+global.currentUser.uid+'/infos').once('value')
  .then((result) => {
    const user = result.val();
    let data = {
      mail: user.mail,
      phoneNumber: user.phoneNumber,
      nameSurname: user.nameSurname,
      kanGrubu: req.body.kanGrubu,
      ilce: req.body.ilce,
      il: Sehirler[req.body.il-1].il,
      aciklama: req.body.aciklama
    }
    firebase.database().ref('usersdata/'+global.currentUser.uid+'/ilanlar').push(data)
      .then(() => {
            res.redirect('/ilanlarim');
      })
      .catch((err) => {
        res.send(err);
      })
  })
  .catch((err) => {
    res.redirect('/ilanlarim');
  })
});
router.post('/passwordchange',isLoggedIn,(req,res) => {
  firebase.auth().currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(firebase.auth().currentUser.email, req.body.oldpassword))
      .then(() => {
        firebase.auth().currentUser.updatePassword(req.body.newpassword).then(() => {
          res.send('success');
        })
        .catch((err) => {
          res.send('saveerror');
        })
      })
      .catch((err) => {
        res.send('passworderror');
      });

});

router.post('/profileupdate', isLoggedIn, (req,res) => {
	let check = 'false';
	if(req.body.check) {
		check = 'true';
	}
  firebase.database().ref('usersdata/'+global.currentUser.uid+'/infos').update({
    phoneNumber : req.body.phoneNumber,
    nameSurname : req.body.nameSurname,
    kanGrubu : req.body.kanGrubu,
    ilce : req.body.ilce,
    il : Sehirler[req.body.il-1].il,
    adres : req.body.adres,
	visibility: check
  })
    .then(() => {
      res.send('success');
    }).catch(() => {
      res.send('error');
    })
});

function isLoggedIn(req,res,next) {
  if (global.currentUser) {
    return next();
  } else {
    res.redirect("signin");
  }

}
module.exports = router;
