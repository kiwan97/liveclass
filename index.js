const path = require('path');
const express = require('express');
const app = express();
const server = app.listen(3000,()=>{console.log("local 3000 is listen");});
const io = require('socket.io').listen(server);
let userlist = [];
console.log(io.path);

app.use("/static", express.static("static"));
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname+'/views/index.html'));
});

io.on('connection', function(socket){
    socket.on('image',function(data){
        io.sockets.emit('image',data);
    }); 
    socket.on('newclient',function(data){
        userlist.push(data);
        io.sockets.emit('newclient',data);
    });
    socket.on('newbie',function(data){
        io.to(data).emit('userlist_init', userlist);
    });
});