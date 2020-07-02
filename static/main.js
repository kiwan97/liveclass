var imageElm = document.getElementById('image2');
const socket = io.connect('http://192.168.0.7:3000');
const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const snapSoundElement = document.getElementById('snapSound');
const webcam = new Webcam(webcamElement, 'user', canvasElement, null);
const btn1 = document.getElementById('btn1');
const imgcontainer = document.getElementById('image_container');
let userlist = [];

btn1.addEventListener('click',function(){
    const newimg = document.createElement('img');
    newimg.id = 'image#'+socket.id;
    userlist.push(socket.id);
    imgcontainer.appendChild(newimg);
    socket.emit('newclient',socket.id);
    const snapfun = function(){
        var picture = webcam.snap();
        socket.emit('image', {picture:picture, id:socket.id});
    }   
    setInterval(snapfun,200);

    const sendUserid = function(){
        socket.emit('newclient',socket.id);
    }
    setInterval(sendUserid,1000);

    btn1.style="display: none;";
});

socket.on('image',(data) => {
    var newid = data.id;
    const newimg = document.getElementById('image#'+newid);
    newimg.src = data.picture;
});
socket.on('newclient',(data) => {
    var check = false;
    for(var i = 0; i<userlist.length;i++){
        if(userlist[i] == data){
            check = true;
            break;
        }
    }
    if(check)
        return;
    console.log('newclient'+data);
    var newid = data;
    const newimg = document.createElement('img');
    newimg.id = 'image#'+newid;
    imgcontainer.appendChild(newimg);
    userlist.push(data);
});
socket.on('userlist_init',(data) => {
    userlist = data;
    for(var i = 0;userlist.length;i++){
        var newid = userlist[i];
        const newimg = document.createElement('img');
        newimg.id = 'image#'+newid;
        imgcontainer.appendChild(newimg);
    }
});
webcam.start()
.then(result =>{
    console.log("webcam started");
})
.catch(err => {
    console.log(err);
});

function init(){
    socket.emit('newbie',socket.id);
}

init();