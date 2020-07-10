var imageElm = document.getElementById('image2');
const socket = io.connect('http://localhost:3000');
const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const snapSoundElement = document.getElementById('snapSound');
const webcam = new Webcam(webcamElement, 'user', canvasElement, null);
const btn1 = document.getElementById('btn1');
const imgcontainer = document.getElementById('image_container');

let timelist = {};
let isBuilder = false;

const addNewimg = function(socketid){
    const newimg = document.createElement('img');
    newimg.id = 'image#'+socketid;
    imgcontainer.appendChild(newimg);
};
const delNewimg = function(socketid){
    const delimg = document.getElementById('image#'+socketid);
    delimg.remove();
};
btn1.addEventListener('click',function(){
    addNewimg(socket.id);
    console.log('socket.id : ',socket.id);
    const snapfun = function(){
        var picture = webcam.snap();
        socket.emit('image', {picture:picture, id:socket.id, room:roomName});
    }   
    setInterval(snapfun,500);
    btn1.style="display: none;";
});
btn2.addEventListener('click',function(){
    socket.emit('refresh',socket.id);
});

socket.on('image',(data) => {
    const newimg = document.getElementById('image#'+data.id);
    if(newimg == null){
        addNewimg(data.id);
    }
    newimg.src = data.picture;
    timelist[data.id] = new Date();
});
socket.on('isBuilder', (data) => {
    isBuilder = true;
    console.log("I'm builder!");
});
socket.on('user-connected', (data) => {
    addNewimg(data.name);
});
webcam.start()
.then(result =>{
    console.log("webcam started");
})
.catch(err => {
    console.log(err);
});

const checkTimeOut = function(){
    Object.keys(timelist).forEach( id => {
        const diff = (new Date()) - timelist[id];
        if(diff > 1000){
            delNewimg(id);
            delete timelist[id];
        }
    });
};
const init = function(){
    console.log("my nickname : ", nickName);
    socket.emit('room-enter', {room:roomName, name: socket.id});
    console.log('init : ', socket.id);
    setInterval(checkTimeOut,3000);
};

setTimeout(init, 1000);
