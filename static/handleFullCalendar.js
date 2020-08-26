var variableJSON = JSON.parse($('#variableJSON').text());
$('#variableJSON').remove();
variableJSON = JSON.parse(variableJSON);
console.log(variableJSON);
var eventArr = [];
variableJSON.forEach(element=>{
    console.log(element);
    var event = {
        title: element.title,
        start: element.startTime,
        end: element.endTime,
        url: "/class/"+element.className+"/"+element.schedId
    }
    eventArr.push(event);
});
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
//       events: [
//   { // this object will be "parsed" into an Event Object
//     title: 'The Title', // a property!
//     start: '2020-08-25', // a property!
//     end: '2020-08-27', // a property! ** see important note below about 'end' **
//     url: "/"
//   }
// ],
        events: eventArr,
      initialView: 'dayGridMonth'
    });
    calendar.render();
  });