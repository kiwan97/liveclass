const {User} = require("../models/User");
const passport = require("passport");


const postJoin = async (req,res,next) => {
    const{
        body:{name,
        email,
        password,
        password2}
    } = req;
    if (password !== password2) {
        res.status(400);
        res.redirect("/join");
    } 
    else {
        try {
          const user = await User({
            name,
            email
          });
            await User.register(user, password);
            next();
        } catch (error) {
          console.log(error);
        }
    }
    res.redirect('/');
}
exports.postJoin = postJoin;


const postLogin = passport.authenticate("local", {
  failureRedirect: "/login",
  successRedirect: "/rooms"
});
exports.postLogin = postLogin;

const getLogout = (req, res) => {
  req.logout();
  res.redirect("/");
};
exports.getLogout = getLogout;

const googleLoginCallback = async (accessToken, refreshToken, profile, cb) => {
  console.log(profile);
  const {
    _json: { name, email,picture }
  } = profile;
  console.log("picture : "+picture);
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.picture = picture;
      user.save();
      console.log(user.picture);
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      picture
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};
exports.googleLoginCallback = googleLoginCallback;

const postGoogleLogin = (req, res) => {
  // Successful authentication, redirect home.
  console.log("Successful authentication, redirect home.");
  res.redirect("/");
};
exports.postGoogleLogin = postGoogleLogin;