const socket = io.connect('http://localhost:3000');
// const socket = io.connect('https://liveclass2020.com');
const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const snapSoundElement = document.getElementById('snapSound');
const webcam = new Webcam(webcamElement, 'user', canvasElement, null);
const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
const imgcontainer = document.getElementById('image_container');
const teacher_container = document.getElementById('teacher_container');
const chatForm = document.getElementById('chatForm');
const chat_board = document.getElementById('chat_board');
var mediaRecorder;
var setintervalID;
let timelist = {};
console.log("room.js");
chatForm.addEventListener('submit', e=>{
    e.preventDefault();

    const msg = e.target.elements.chat.value;
    e.target.elements.chat.value = "";
    socket.emit('chat',{sender: cur_email, room:roomName, msg: msg});
});

const addNewimg = function(email){
    const newimg = document.createElement('img');
    const newname = document.createElement('span');
    newimg.id = 'image#'+email;
    newname.innerText = email;
    newname.id = 'span#' + email;
    
    if(email != builder){
        newname.innerText = "Student : " + newname.innerText;
        const newcontainer = document.createElement('div');
        newcontainer.classList.add('student_container');
        newcontainer.id = 'student#'+email;

        newimg.classList.add("student_video");
        newcontainer.appendChild(newimg);
        newcontainer.appendChild(newname);
        imgcontainer.appendChild(newcontainer);
    }
    else{
        newname.innerText = "Teacher : " + newname.innerText;
        newimg.classList.add("teacher_video")
        teacher_container.appendChild(newimg);
        teacher_container.appendChild(newname);
    }
        
};
const delNewimg = function(email){
    const delimg = document.getElementById('image#'+email);
    const delcontainer = document.getElementById('student#'+email);
    const delspan = document.getElementById('span#' + email);
    delimg.remove();
    delcontainer.remove();
    delspan.remove();
};
btn1.addEventListener('click',function(){
    const snapfun = async function(){
        var picture = await webcam.snap();
        socket.emit('image', {picture:picture, room:roomName, email: cur_email});
    }   
    setInterval(snapfun,500);
    btn1.style="display: none;";
});
function mediaRecoderOFFON(){
    mediaRecorder.stop();
    mediaRecorder.start();
}
btn2.addEventListener('click',function(){
    console.log(btn2.innerText);
    
    if(btn2.innerText == "audio on"){
        mediaRecorder.start();
        setintervalID = setInterval(mediaRecoderOFFON,1000);
        console.log("on it on : ",setintervalID);
        btn2.innerText = "audio off";
    }else if(btn2.innerText == "audio off"){
        console.log("interval id : ", setintervalID)
        clearInterval(setintervalID);
        mediaRecorder.stop();
        btn2.innerText = "audio on";
    }
});

socket.on('image',(data) => {
    const newimg = document.getElementById('image#'+data.email);
    if(newimg == null){
        console.log("no new img");
        addNewimg(data.email);
    }else{
        newimg.src = data.picture;
        timelist[data.email] = new Date();
    }
});
socket.on('face', (data)=>{
    const stucontainer = document.getElementById('student#'+data.email);
    if(stucontainer !=null){
        if(data.face == "no Face!!!"){
            stucontainer.style.backgroundColor = "#ff7675";
        }else if(data.face == "no eyes!!!"){
            stucontainer.style.backgroundColor = "#ffeaa7";
        }else if(data.face == "eyes!!!"){
            stucontainer.style.backgroundColor = "#55efc4";
        }
    }
});
socket.on('chat', (data)=>{
    const tmp = document.createElement('div');
    tmp.classList.add("chat-span")
    tmp.innerText = data.sender + " : " + data.msg + '\n';
    chat_board.appendChild(tmp);
    chat_board.scrollTop = chat_board.scrollHeight;
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

 //audio
 var constraints = { audio: true };
 
 navigator.mediaDevices.getUserMedia(constraints).then(function(mediaStream) {
     mediaRecorder = new MediaRecorder(mediaStream);
     mediaRecorder.onstart = function(e) {
         this.chunks = [];
     };
     mediaRecorder.ondataavailable = function(e) {
         this.chunks.push(e.data);
     };
     mediaRecorder.onstop = function(e) {
         var blob = new Blob(this.chunks, { 'type' : 'audio/ogg; codecs=opus' });
         socket.emit('radio',{room:roomName, blob: blob});
     };
 
     // Start recording
    //  mediaRecorder.start();
    
     // Stop recording after 5 seconds and broadcast it to server
    //  setTimeout(function() {
    //      mediaRecorder.stop()
    //  }, 5000);
 });
 

 // When the client receives a voice message it will play the sound
 socket.on('voice', function(arrayBuffer) {
     var blob = new Blob([arrayBuffer], { 'type' : 'audio/ogg; codecs=opus' });
     var audio = document.createElement('audio');
     audio.src = window.URL.createObjectURL(blob);
     audio.play();
 });


//floating window
document.ready(function(){
    $(function() {
      $( "#console" ).draggable();
    })
  });
function drag(){
    $(function() { $( "#console" ).draggable() } )
    $(function() { $( "#dragbtn" ).remove() } )
};
 
