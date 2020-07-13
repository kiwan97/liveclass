const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20');
const {User} = require("./models/User");
const {googleLoginCallback} = require("./controllers/userController");


passport.use(User.createStrategy());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_PW,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },googleLoginCallback
  
  ));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());