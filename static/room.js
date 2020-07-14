const socket = io.connect('http://localhost:3000');
const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const snapSoundElement = document.getElementById('snapSound');
const webcam = new Webcam(webcamElement, 'user', canvasElement, null);
const btn1 = document.getElementById('btn1');
const imgcontainer = document.getElementById('image_container');
const teacher_container = document.getElementById('teacher_container');

let timelist = {};

const addNewimg = function(email){
    const newimg = document.createElement('img');
    newimg.id = 'image#'+email;
    if(email != builder){
        newimg.classList.add("student_video");
        imgcontainer.appendChild(newimg);
    }
    else{
        newimg.classList.add("teacher_video")
        teacher_container.appendChild(newimg);
    }
        
};
const delNewimg = function(email){
    const delimg = document.getElementById('image#'+email);
    delimg.remove();
};
btn1.addEventListener('click',function(){
    const snapfun = function(){
        var picture = webcam.snap();
        socket.emit('image', {picture:picture, room:roomName, email: cur_email});
    }   
    setInterval(snapfun,500);
    btn1.style="display: none;";
});

socket.on('image',(data) => {
    const newimg = document.getElementById('image#'+data.email);
    if(newimg == null){
        addNewimg(data.email);
    }else{
        newimg.src = data.picture;
        timelist[data.email] = new Date();
    }
});
webcam.start()
.then(result =>{
    console.log("webcam started");
})
.catch(err => {
    console.log(err);
});

const checkTimeOut = function(){
    Object.keys(timelist).forEach( email => {
        const diff = (new Date()) - timelist[email];
        if(diff > 1000){
            delNewimg(email);
            delete timelist[email];
        }
    });
};
const init = function(){
    setInterval(checkTimeOut,3000);
    socket.emit('room-enter', {room:roomName, name: socket.id});
};
init();

