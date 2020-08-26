
const daily_day = document.getElementById('daily-day');
const daily_month = document.getElementById('daily-month');
const daily_year = document.getElementById('daily-year');
const daily_title = document.getElementById('daily-title');
const sched_container = document.getElementById('dailySchedule');
const bulletin_board = document.getElementById('bulletin-board');
const enteredUser_board = document.getElementById('enteredUser-board');
const daily_roomlist = document.getElementById('class-list');
var variableJSON = JSON.parse($('#variableJSON').text());
var variableJSON2 = JSON.parse($('#variableJSON2').text());
let sched_cnt = 0;
$('#variableJSON').remove();
$('#variableJSON2').remove();
console.log("I'm tired");
console.log(variableJSON);
console.log("variable2 : ",variableJSON2);
console.log('cur_email : ',cur_email);
variableJSON = JSON.parse(variableJSON);
console.log(variableJSON);
for(let i=0;i<variableJSON.length;i++){
  const bulletin_elm = document.createElement('div');
  const Num = document.createElement('div');
  const title = document.createElement('div');
  const writer = document.createElement('div');
  const bulletin_a = document.createElement('a');

  variableJSON[i].month = parseInt(variableJSON[i].month);
  variableJSON[i].year = parseInt(variableJSON[i].year);
  variableJSON[i].day = parseInt(variableJSON[i].day);

  Num.innerText = sched_cnt++;
  title.innerText = variableJSON[i].title;
  writer.innerText = variableJSON[i].writer;
  bulletin_a.href = window.location.href + "/" + variableJSON[i].schedId;

  bulletin_elm.classList.add('bulletin-element');
  Num.classList.add('bulletin-num');
  title.classList.add('bulletin-element-title');
  writer.classList.add('bulletin-element-writer');

  bulletin_elm.appendChild(Num);
  bulletin_elm.appendChild(title);
  bulletin_elm.appendChild(writer);
  bulletin_a.appendChild(bulletin_elm);
  // bulletin_board.appendChild(bulletin_elm);
  bulletin_board.appendChild(bulletin_a);
}


for(let i=0;i<variableJSON2.length;i++){
  const enteredUser_elm = document.createElement('div');
  const enteredUser_email = document.createElement('div');
  const enteredUser_name = document.createElement('div');
  const enteredUser_a = document.createElement('a');

  enteredUser_email.innerText = "email : " + variableJSON2[i].email;
  enteredUser_name.innerText = "name : " + variableJSON2[i].name;
  enteredUser_a.innerText = "Link to profile";
  enteredUser_a.href = window.location.href.split("/")[0] + "/user/" + variableJSON2[i].email;
  console.log("href : ",enteredUser_a.href);

  enteredUser_elm.classList.add('enteredUser-element');
  enteredUser_email.classList.add('enteredUser-element-email');
  enteredUser_name.classList.add('enteredUser-element-name');

  enteredUser_elm.appendChild(enteredUser_email);
  enteredUser_elm.appendChild(enteredUser_name);
  enteredUser_elm.appendChild(enteredUser_a);

  enteredUser_board.appendChild(enteredUser_elm);
}

const init = {
    monList: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    dayList: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    today: new Date(),
    monForChange: new Date().getMonth(),
    activeDate: new Date(),
    getFirstDay: (yy, mm) => new Date(yy, mm, 1),
    getLastDay: (yy, mm) => new Date(yy, mm + 1, 0),
    nextMonth: function () {
      let d = new Date();
      d.setDate(1);
      d.setMonth(++this.monForChange);
      this.activeDate = d;
      return d;
    },
    prevMonth: function () {
      let d = new Date();
      d.setDate(1);
      d.setMonth(--this.monForChange);
      this.activeDate = d;
      return d;
    },
    addZero: (num) => (num < 10) ? '0' + num : num,
    activeDTag: null,
    getIndex: function (node) {
      let index = 0;
      while (node = node.previousElementSibling) {
        index++;
      }
      return index;
    }
  };
  
  const $calBody = document.querySelector('.cal-body');
  const $btnNext = document.querySelector('.btn-cal.next');
  const $btnPrev = document.querySelector('.btn-cal.prev');
  
  /**
   * @param {number} date
   * @param {number} dayIn
  */
  function loadDate (date, dayIn) {
    document.querySelector('.cal-date').textContent = date;
    document.querySelector('.cal-day').textContent = init.dayList[dayIn];
  }
  
  /**
   * @param {date} fullDate
   */
  function loadYYMM (fullDate) {
    let yy = fullDate.getFullYear();
    let mm = fullDate.getMonth();
    let firstDay = init.getFirstDay(yy, mm);
    let lastDay = init.getLastDay(yy, mm);
    let markToday;  // for marking today date
    
    if (mm === init.today.getMonth() && yy === init.today.getFullYear()) {
      markToday = init.today.getDate();
    }
  
    document.querySelector('.cal-month').textContent = init.monList[mm];
    document.querySelector('.cal-year').textContent = yy;
  
    let trtd = '';
    let startCount;
    let countDay = 0;
    for (let i = 0; i < 6; i++) {
      trtd += '<tr>';
      for (let j = 0; j < 7; j++) {
        if (i === 0 && !startCount && j === firstDay.getDay()) {
          startCount = 1;
        }
        if (!startCount) {
          trtd += '<td>'
        } else {
          let fullDate = yy + '.' + init.addZero(mm + 1) + '.' + init.addZero(countDay + 1);
          trtd += '<td class="day';
          trtd += (markToday && markToday === countDay + 1) ? ' today" ' : '"';
          trtd += ` data-date="${countDay + 1}" data-fdate="${fullDate}">`;
        }
        trtd += (startCount) ? ++countDay : '';
        if (countDay === lastDay.getDate()) { 
          startCount = 0; 
        }
        trtd += '</td>';
      }
      trtd += '</tr>';
    }
    $calBody.innerHTML = trtd;

    //myown
    daily_year.value = yy;
    daily_month.value = mm;
    daily_day.value = markToday;
  }
  
  /**
   * @param {string} val
   */
  function createNewList (val) {
    let id = new Date().getTime() + '';
    let yy = init.activeDate.getFullYear();
    let mm = init.activeDate.getMonth() + 1;
    let dd = init.activeDate.getDate();
    const $target = $calBody.querySelector(`.day[data-date="${dd}"]`);
  
    let date = yy + '.' + init.addZero(mm) + '.' + init.addZero(dd);
  
    let eventData = {};
    eventData['date'] = date;
    eventData['memo'] = val;
    eventData['complete'] = false;
    eventData['id'] = id;
    init.event.push(eventData);
    $todoList.appendChild(createLi(id, val, date));
  }
  function reloadTodo(yy, mm, dd){
    // sched_container.innerHTML = '';
    daily_roomlist.innerHTML = '';
    const result = variableJSON.filter(schedule => schedule.year == yy && schedule.month == mm && schedule.day == dd);
    for(let i=0;i<result.length;i++){
      console.log(result[i]);
      const newSpan = document.createElement('span');
      const newA = document.createElement('a');
      newSpan.innerText = "ROOM : " + result[i].room;
      newA.href = "/"+result[i].room;
      newA.title = "Room link";
      newA.appendChild(newSpan);
      // sched_container.appendChild(newSpan);
      // daily_roomlist.appendChild(newSpan);
      daily_roomlist.appendChild(newA);

    }
  }
  loadYYMM(init.today);
  loadDate(init.today.getDate(), init.today.getDay());
  
  $btnNext.addEventListener('click', () => loadYYMM(init.nextMonth()));
  $btnPrev.addEventListener('click', () => loadYYMM(init.prevMonth()));
  
  $calBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('day')) {
      if (init.activeDTag) {
        init.activeDTag.classList.remove('day-active');
      }
      let day = Number(e.target.textContent);
      loadDate(day, e.target.cellIndex);
      e.target.classList.add('day-active');
      init.activeDTag = e.target;
      init.activeDate.setDate(day);
      daily_day.value = day;
      reloadTodo(daily_year.value,daily_month.value,daily_day.value);
    }
  });

  //myown



const schedForm = document.getElementById('daily-schedule-form');
const daily_input = document.getElementById('daily-input');
const formSubmitFunc = async (event) => {
  event.preventDefault();
  const day_ = daily_day.value;
  const month_ = daily_month.value;
  const info = daily_input.value;
  const year_ = daily_year.value;
  const title_ = daily_title.value;
  const writer_ = cur_email;
  const class_ = window.location.href.split("class/")[1];
  daily_input.value = '';
  try{
    fetch('/api/addClassSched', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body:  JSON.stringify({class:class_,writer:writer_,title:title_,year:year_, month:month_,day:day_,info:info}),
    }).then(function(response) {
      console.log(response);
    });
  }catch(error){
        console.log(error);
  }
}

schedForm.addEventListener('submit',formSubmitFunc);


  