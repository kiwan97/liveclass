const imageElm = document.getElementById('image2');
const socket = io.connect('http://192.168.0.7:3000');
console.log(socket);
socket.on('image',(data) => {
    imageElm.src = `data:image/jpeg;base64,${data}`;
    
});
