var variableJSON = JSON.parse($('#variableJSON').text());
let sched_cnt = 0;
$('#variableJSON').remove();
console.log("I'm tired");
console.log(variableJSON);
console.log('cur_email : ',cur_email);
variableJSON = JSON.parse(variableJSON);
console.log(variableJSON);

const main_container = document.getElementById('main-container');
const sched_title = document.getElementById('sched-title');
const sched_info = document.getElementById('sched-info');
const sched_writer = document.getElementById('sched-writer');
const sched_month = document.getElementById('month');
const sched_year = document.getElementById('year');
const sched_day = document.getElementById('day');
const sched_startTime = document.getElementById('startTime');
const shced_endTime = document.getElementById('endTime');

sched_title.innerText = variableJSON[0].title;
sched_info.innerText = variableJSON[0].info;
sched_writer.innerText = variableJSON[0].writer;
sched_year.innerText = variableJSON[0].year;
sched_month.innerText = Number(variableJSON[0].month)+1;
sched_day.innerText = variableJSON[0].day;

