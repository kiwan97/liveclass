const daily_day = document.getElementById('daily-day');
const daily_month = document.getElementById('daily-month');
const daily_year = document.getElementById('daily-year');
const daily_title = document.getElementById('daily-title');
const schedForm = document.getElementById('daily-schedule-form');
const daily_input = document.getElementById('daily-input');
const daily_startTime = document.getElementById('daily-startTime');
const daily_endTime = document.getElementById('daily-endTime');

const formSubmitFunc = async (event) => {
    event.preventDefault();
    const day_ = daily_day.value;
    const month_ = daily_month.value;
    const info = daily_input.value;
    const year_ = daily_year.value;
    const title_ = daily_title.value;
    const writer_ = cur_email;
    const startTime_ = daily_startTime.value;
    const endTime_ = daily_endTime.value;
    const class_ = window.location.href.split("class/")[1];
    daily_input.value = '';
    try{
      fetch('/api/addClassSched', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body:  JSON.stringify({class:class_,writer:writer_,title:title_,year:year_, month:month_,day:day_,startTime:startTime_,endTime:endTime_,info:info}),
      }).then(function(response) {
        console.log(response);
      });
    }catch(error){
          console.log(error);
    }
  }