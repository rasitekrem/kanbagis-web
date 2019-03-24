const mongoose = require('mongoose'),
  express = require('express'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  expressSession = require('express-session'),
  User = require('./models/userModel'),
  UserInfo = require('./models/userInfoModel'),
  app = express(),
  bodyParser = require("body-parser"),
  firebase = require('firebase');

const Routes = require("./routes/Routes");
const authRoutes = require("./routes/authRoutes");
//App config
firebase.initializeApp({
  apiKey: "<API_KEY>",
  authDomain: "<AUTH_DOMAIN>",
  databaseURL: "<DB_URL>",
  projectId: "<PROJECT_ID>",
  storageBucket: "<STORAGE_BUCKET>",
  messagingSenderId: ""
});
currentUser = null;
mongoose.connect("<mongoconfig>");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(require("express-session")({
  secret: "secretKanDonorText",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    currentUser = user;
  } else {
    currentUser = null;
  }
});
//Share current user info within all Routes

app.use((req, res, next) => {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');//mobile geçince buradan istek ayarı yapacağız
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Origin, Content-Type, Accept');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use(Routes);
app.use(authRoutes);
const server = app.listen(3000, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("Sunucu Portu : %d ", server.address().port);
});
