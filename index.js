const cv = require('opencv4nodejs');
const path = require('path');
const express = require('express');
const app = express();
const server = app.listen(3000,()=>{console.log("local 3000 is listen");});
const io = require('socket.io').listen(server);
console.log(io.path);


const FPS = 15;
// const wCap = new cv.VideoCapture(0);
// wCap.set(cv.CAP_PROP_FRAME_WIDTH,300);
// wCap.set(cv.CAP_PROP_FRAME_HEIGHT,300);
app.use("/static", express.static("static"));
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname+'/views/index.html'));
});

// setInterval(() => {
//     const frame = wCap.read();
//     const image = cv.imencode('.jpg',frame).toString('base64');
//     io.emit('image', image);
// }, 1000/FPS);

io.on('connection', function(socket){
    socket.on('image',function(data){
        io.sockets.emit('image',data);
    });
});