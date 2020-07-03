var imageElm = document.getElementById('image2');
const socket = io.connect('http://192.168.0.7:3000');
const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const snapSoundElement = document.getElementById('snapSound');
const webcam = new Webcam(webcamElement, 'user', canvasElement, null);
const btn1 = document.getElementById('btn1');
const imgcontainer = document.getElementById('image_container');
let userlist = [];

const addNewimg = function(socketid){
    const newimg = document.createElement('img');
    newimg.id = 'image#'+socketid;
    imgcontainer.appendChild(newimg);
    userlist.push(socketid);
};
btn1.addEventListener('click',function(){
    addNewimg(socket.id);
    socket.emit('newclient',socket.id);
    const snapfun = function(){
        var picture = webcam.snap();
        socket.emit('image', {picture:picture, id:socket.id});
    }   
    setInterval(snapfun,500);
    btn1.style="display: none;";
});
btn2.addEventListener('click',function(){
    socket.emit('refresh',socket.id);
});
socket.on('image',(data) => {
    console.log("Listening id : ",data.id);
    const newimg = document.getElementById('image#'+data.id);
    newimg.src = data.picture;
});
socket.on('refresh',(data) => {
    console.log('refresh',data);
    let diff = data.filter( 
        function(el) {
          return userlist.indexOf(el) < 0;
        }
    );
    console.log('diff : ',diff);
    for(let i=0; i<diff.length;i++){
        addNewimg(diff[i]);
        userlist.push(diff[i]);
    }
    
});
webcam.start()
.then(result =>{
    console.log("webcam started");
})
.catch(err => {
    console.log(err);
});
