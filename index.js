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
// const server = app.listen(80,()=>{console.log("local 80 is listen");});
const io = require('socket.io').listen(server);
const bodyParser = require("body-parser");
const { PythonShell } = require('python-shell');
const CookieParser = require('cookie-parser');
const {postJoin,postLogin,getLogout,postGoogleLogin} = require('./controllers/userController');
const passport = require("passport");
let roomlist = {};
let classlist = {};
let userlist = {};
let userFaceData = {};
let GuestCnt = 0;
// let shell = new PythonShell('/Users/kiwankim/Downloads/Chrome/eye_py/Closed-Eye-Detection-with-opencv/cv_close_eye_detect2.py');
let shell = new PythonShell('facedetect-py/cv_close_eye_detect2.py');
shell.on('message', function (message) {
        // received a message sent from the Python script (a simple "print" statement)
        console.log(message);
        var res = message.split('@');
        io.to(res[1]).emit('face',{face:res[0], email:res[2]});

        if(userFaceData[res[2]]==null){
            userFaceData[res[2]] = {noFace:[],noEyes:[],yesEyes:[]};
        }
        var curDate = new Date();
        var curTime = curDate.getFullYear() + "/"
            + (curDate.getMonth()+1) + "/"
            + curDate.getDate() + "/"
            + curDate.getHours() + "/"
            + curDate.getMinutes();
        if(res[0]=="no Face!!!")
            userFaceData[res[2]].noFace.push(curTime);
        else if(res[0]=="no eyes!!!")
            userFaceData[res[2]].noEyes.push(curTime);
        else if(res[0]=="eyes!!!")
            userFaceData[res[2]].yesEyes.push(curTime);
        
});

const localsMiddleWares= (req,res,next) => {
    if(!req.user){
        if(!req.session.user)
            req.session.user = {email:"Guest"+GuestCnt, name: "Guest"+GuestCnt++};
        req.user = req.session.user;
    }
    
    res.locals.user = req.user || null;
    userlist[res.locals.user.email] = {email: res.locals.user.email, name:res.locals.user.name};
    next();
};

app.use(CookieParser());
app.use("/static", express.static("static"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs')


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


app.get('/',(req,res)=>{
    res.render(__dirname +'/views/tutor/tutor/index', {rooms: roomlist, classes: classlist});
});
app.get('/rooms',(req,res)=>{
    res.render(__dirname +'/views/tutor/tutor/rooms',{rooms: roomlist});
});
app.get('/login',(req,res)=>{
    res.render(__dirname +'/views/tutor/tutor/login');
});
app.get('/join',(req,res)=>{
    res.render(__dirname +'/views/tutor/tutor/join');
});
app.get('/classes',(req,res)=>{
    res.render(__dirname +'/views/tutor/tutor/classes',{classes: classlist});
});
app.get('/class/:className', (req,res) => {
    if (classlist[req.params.className] == null){
        return res.redirect('/');
    }
    var tmp_cnt = 0;
    classlist[req.params.className].users.forEach(elm => {if(elm.email == res.locals.user.email) tmp_cnt++});
    if(tmp_cnt == 0)
        classlist[req.params.className].users.push(res.locals.user);
    res.render(__dirname +'/views/tutor/tutor/class',{ className: req.params.className, builder: classlist[req.params.className].builder, dailysched: JSON.stringify(classlist[req.params.className].dailysched), enteredUser: classlist[req.params.className].users});
});
app.get('/class/:className/addSchedForm',(req,res)=>{
    if(classlist[req.params.className]== null){
        return res.redirect('/');
    }
    res.render(__dirname +'/views/tutor/tutor/newAddSchedForm', {className: req.params.className, builder: classlist[req.params.className].builder});
});
app.get('/class/:className/:schedId',(req,res)=>{
    const {
        params: {className, schedId}
    } = req;

    var filteredSched = classlist[req.params.className].dailysched.filter(sched => sched.schedId == schedId);
    res.render(__dirname +'/views/tutor/tutor/schedule',{className: req.params.className, builder: classlist[req.params.className].builder, sched: JSON.stringify(filteredSched)});
});
app.get('/user/:userEmail',(req,res)=>{
    if(userlist[req.params.userEmail]== null){
        console.log("I can't find user.");
        return res.redirect('/');
    }
    if(userFaceData[req.params.userEmail]==null){
        userFaceData[req.params.userEmail] = {noFace:[],noEyes:[],yesEyes:[]};
    }
    res.render(__dirname +'/views/tutor/tutor/profile',{userEmail: userlist[req.params.userEmail].email,userName: userlist[req.params.userEmail].name, userFace: JSON.stringify(userFaceData[req.params.userEmail])});
});

app.post("/join",postJoin,postLogin);

app.post("/login",postLogin);

app.get("/logout",getLogout);

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  postGoogleLogin
);

app.post('/class',(req,res) => {
    if(classlist[req.body.class] != null){
        return res.redirect('/classes');
    }
    
    classlist[req.body.class] = {users: [], builder: res.locals.user.email, dailysched: []};
    res.redirect("/classes");
});

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

app.post('/api/addClassSched',(req,res)=>{
    const {
        body: {className2,title,writer,info,room,startTime,endTime}
    } = req;
    const newId = '_' + Math.random().toString(36).substr(2, 9);
    console.log("className2 : ",className2);
    classlist[className2].dailysched.push({"schedId":newId,"className":className2,"title":title,"writer":writer, "info": info,"room":room,"startTime":startTime,"endTime":endTime});
    res.end();
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
        
        shell.send(JSON.stringify({arg: data.picture, room: data.room, email: data.email}));
    });
    socket.on('room-enter', (data) => {
        socket.join(data.room);
    });
    socket.on('chat',(data) => {
        io.to(data.room).emit('chat',data);
    });
    socket.on('radio', function(data) {
        // can choose to broadcast it to whoever you want
        console.log("Radio in ! ");
        io.to(data.room).emit('voice', data.blob);
    });
});