const daily_title = document.getElementById('daily-title');
const schedForm = document.getElementById('daily-schedule-form');
const daily_input = document.getElementById('daily-input');
const daily_startTime = document.getElementById('daily-startTime');
const daily_endTime = document.getElementById('daily-endTime');
const daily_room = document.getElementById('daily-room');

const formSubmitFunc = async (event) => {
    event.preventDefault();
    console.log("formSubmitFunc");
    const info = daily_input.value;
    daily_input.value = "";
    const title_ = daily_title.value;
    daily_title.value = "";
    const writer_ = cur_email;
    const startTime_ = daily_startTime.value;
    daily_startTime.value = null;
    const endTime_ = daily_endTime.value;
    daily_endTime.value = null;
    const room_ = daily_room.value;
    daily_room.value = "";
    const class_ = window.location.href.split("class/")[1].split("/")[0];
  
    daily_input.value = '';
    try{
      fetch('/api/addClassSched', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body:  JSON.stringify({className2:class_,writer:writer_,title:title_,startTime:startTime_,endTime:endTime_,info:info,room:room_}),
      }).then(function(response) {
        console.log(response);
      });
    }catch(error){
          console.log(error);
    }

  }

schedForm.addEventListener('submit',formSubmitFunc);
