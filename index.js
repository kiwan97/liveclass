require('./db');
require('./passport');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const path = require('path');
const express = require('express');
const session = require("express-session");
const app = express();
const CookieStore = MongoStore(session);
const server = app.listen(3000,()=>{console.log("local 3000 is listen");});
const io = require('socket.io').listen(server);
const bodyParser = require("body-parser");
const { PythonShell } = require('python-shell');
const CookieParser = require('cookie-parser');
const {getJoin,postJoin,getLogin,postLogin,getLogout,postGoogleLogin} = require('./controllers/userController');
const passport = require("passport");
let roomlist = {};
let GuestCnt = 0;
let shell = new PythonShell('/Users/kiwankim/Downloads/Chrome/eye_py/Closed-Eye-Detection-with-opencv/cv_close_eye_detect2.py');
shell.on('message', function (message) {
        // received a message sent from the Python script (a simple "print" statement)
        console.log(message);
    });

const localsMiddleWares= (req,res,next) => {
    if(!req.user){
        if(!req.session.user)
            req.session.user = {email:"Guest#"+GuestCnt, name: "Guest#"+GuestCnt++};
        req.user = req.session.user;
    }
    
    res.locals.user = req.user
    console.log(res.locals.user);
    next();
};

app.use(CookieParser());
app.use("/static", express.static("static"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs')


app.get('/room', (req,res) => {
    res.render('room');
});
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: true,
        saveUninitialized: false,
        store: new CookieStore({mongooseConnection: mongoose.connection})
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(localsMiddleWares);



app.get("/join",getJoin);
app.post("/join",postJoin,postLogin);

app.get("/login",getLogin);
app.post("/login",postLogin);

app.get("/logout",getLogout);

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  postGoogleLogin
);


app.post('/room', (req, res) => {
    if (roomlist[req.body.room] != null) {
      return res.redirect('/rooms')
    }
    roomlist[req.body.room] = { users: {}, builder: res.locals.user.email};

    res.redirect(req.body.room);
});
app.post('/rooms',(req,res) => {
    res.redirect('/rooms');
});
app.get('/rooms',(req,res)=>{
    res.render('rooms', {rooms: roomlist});
});
app.get('/:room', (req, res) => {
    if (roomlist[req.params.room] == null){
        return res.redirect('/');
    }
    res.render('room',{ roomName: req.params.room, builder: roomlist[req.params.room].builder});
});

io.on('connection', function(socket){
    socket.on('image',function(data){
        io.to(data.room).emit('image',data);
        console.log("server : ",data.email);
        // let options = {
        //     mode: 'text',
        //     pythonPath: '/Library/Frameworks/Python.framework/Versions/3.7/lib/python3.7',
        //     pythonOptions: ['-u'], // get print results in real-time
        //     scriptPath: '/Users/kiwankim/Downloads/Chrome/eye_py/Closed-Eye-Detection-with-opencv',
        //     args: [data.picture]
        // };
        // let shell = new PythonShell('/Users/kiwankim/Downloads/Chrome/eye_py/Closed-Eye-Detection-with-opencv/cv_close_eye_detect2.py');
        // let shell = new PythonShell('/Users/kiwankim/Downloads/Chrome/eye_py/Closed-Eye-Detection-with-opencv/test2.py');
        shell.send(JSON.stringify({arg: data.picture}));
        // PythonShell.run('cv_close_eye_detect2.py', options,data.picture, (err, results) => {
        //     if (err) throw err;
        //     console.log(`results: ${results}`);
        //   });
        // shell.on('message', function (message) {
        //     // received a message sent from the Python script (a simple "print" statement)
        //     console.log(message);
        // });
        // shell.end(function (err) {
        //     if (err){
        //         throw err;
        //     };
        //     console.log('finished');
        // });
    });
    socket.on('room-enter', (data) => {
        socket.join(data.room);
    });
    
});