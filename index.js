require('./db');
const MongoStore = require('connect-mongo');
const path = require('path');
const express = require('express');
const session = require("express-session");
const app = express();
const CokieStore = MongoStore(session);
const server = app.listen(3000,()=>{console.log("local 3000 is listen");});
const io = require('socket.io').listen(server);
const bodyParser = require("body-parser");
const { PythonShell } = require('python-shell');
const cookieParser = require('cookie-parser');
let userlist = [];
let roomlist = {};
let shell = new PythonShell('/Users/kiwankim/Downloads/Chrome/eye_py/Closed-Eye-Detection-with-opencv/cv_close_eye_detect2.py');
shell.on('message', function (message) {
        // received a message sent from the Python script (a simple "print" statement)
        console.log(message);
    });

const localsMiddleWares= (req,res,next) => {
    if(typeof(req.locals.user) !== 'undefined' )
        res.locals.user = req.locals.user || null;
    console.log("middlewares req.user : ",req.user);
    console.log("logged User : ",res.locals.user);
    next();
};
// app.use(localsMiddleWares);

app.use(cookieParser());
app.use("/static", express.static("static"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs')
app.get('/room', (req,res) => {
    //res.sendFile(path.join(__dirname+'/views/index.html'));
    res.render('room');
});
app.post('/room', (req, res) => {
    if (roomlist[req.body.room] != null) {
      return res.redirect('/rooms')
    }
    roomlist[req.body.room] = { users: {}, builder: req.body.builder };
    res.render('room', { roomName: req.body.room, nickName: req.body.nickName});
    // res.redirect(req.body.room);
    // Send message that new room was created
});
app.post('/rooms',(req,res) => {
    res.locals.tmp = req.body.nickName;
    res.redirect('/rooms');
});
app.get('/rooms',(req,res)=>{
    res.render('rooms', {rooms: roomlist});
});
app.get('/:room', (req, res) => {
    if (roomlist[req.params.room] == null){
        return res.redirect('/');
    }
    res.render('room', { roomName: req.params.room, nickName: "student"});
});

io.on('connection', function(socket){
    socket.on('image',function(data){
        io.to(data.room).emit('image',data);
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
        // console.log('room : ',data.room,', name : ',data.name);
        // roomlist[data.room].users[data.name] = data.name;
        console.log('room builder : ', roomlist[data.room].builder);
        if(roomlist[data.room].builder == data.name)
            io.to(data.name).emit('isBuilder',{});
        io.to(data.room).emit('user-connected',{name: data.name});
        
    });
    
});