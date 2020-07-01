const imageElm = document.getElementById('image2');
const socket = io.connect('http://192.168.0.7:3000');
const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const snapSoundElement = document.getElementById('snapSound');
const webcam = new Webcam(webcamElement, 'user', canvasElement, null);
const btn1 = document.getElementById('btn1');

btn1.addEventListener('click',function(){
    const snapfun = function(){
        var picture = webcam.snap();
        socket.emit('image', picture);
    }   
    setInterval(snapfun,100);
});

socket.on('image',(data) => {
    imageElm.src = data;
    console.log("data is ",data);
});

webcam.start()
.then(result =>{
    console.log("webcam started");
})
.catch(err => {
    console.log(err);
});
