let face_data = [{"time":new Date(), "face":"no eyes!"}, {"time":new Date(), "face":"no face!"}, {"time":new Date(), "face": "face!"}];
let time_label = [];
let noEyes_data = {};
let noFace_data = {};
let yesEyes_data = {};

var variableJSON = JSON.parse($('#variableJSON').text());
variableJSON = JSON.parse(variableJSON);
$('#variableJSON').remove();
console.log(variableJSON.noEyes);

face_data.forEach(function(element){
    var cnt = 0
    var i;
    var tmp = element.time.getFullYear() +"/"
        + element.time.getMonth() +"/"
        + element.time.getDay() +"/"
        + element.time.getHours() +"/"
        + element.time.getMinutes();
    for(i=0;i<time_label.length;i++){
        if(time_label[i]==tmp)
            cnt++;
    }
    if(cnt==0)
        time_label.push(tmp);
});

console.log(time_label);

var barChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [{
        label: 'Dataset 1',
        backgroundColor: window.chartColors.red,
        data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
        ]
    }, {
        label: 'Dataset 2',
        backgroundColor: window.chartColors.blue,
        data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
        ]
    }, {
        label: 'Dataset 3',
        backgroundColor: window.chartColors.green,
        data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
        ]
    }]

};
window.onload = function() {
    var ctx = document.getElementById('canvas').getContext('2d');
    window.myBar = new Chart(ctx, {
        type: 'bar',
        data: barChartData,
        options: {
            title: {
                display: true,
                text: 'Chart.js Bar Chart - Stacked'
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            responsive: true,
            scales: {
                xAxes: [{
                    stacked: true,
                }],
                yAxes: [{
                    stacked: true
                }]
            }
        }
    });
};

document.getElementById('randomizeData').addEventListener('click', function() {
    barChartData.datasets.forEach(function(dataset) {
        dataset.data = dataset.data.map(function() {
            return randomScalingFactor();
        });
    });
    window.myBar.update();
});