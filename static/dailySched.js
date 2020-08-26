var variableJSON = JSON.parse($('#variableJSON').text());
let sched_cnt = 0;
$('#variableJSON').remove();
console.log("I'm tired");
console.log(variableJSON);
variableJSON = JSON.parse(variableJSON);
console.log(variableJSON);

const main_container = document.getElementById('main-container');
const sched_title = document.getElementById('sched-title');
const sched_info = document.getElementById('sched-info');
const sched_writer = document.getElementById('sched-writer');
const sched_startTime = document.getElementById('startTime');
const sched_endTime = document.getElementById('endTime');
const sched_room = document.getElementById('sched-room');
const roomBtn = document.getElementById('roombtn');

sched_title.innerText = variableJSON[0].title;
sched_info.innerText = variableJSON[0].info;
sched_writer.innerText = variableJSON[0].writer;
sched_startTime.innerText = variableJSON[0].startTime;
sched_endTime.innerText = variableJSON[0].endTime;
sched_room.innerText = variableJSON[0].room;
roomBtn.href = "/"+variableJSON[0].room;
