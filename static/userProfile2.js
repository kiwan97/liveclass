let time_label = [];
let noEyes_data = [];
let noFace_data = [];
let yesEyes_data = [];

var variableJSON = JSON.parse($('#variableJSON').text());
variableJSON = JSON.parse(variableJSON);
$('#variableJSON').remove();
console.log(variableJSON);

variableJSON.noFace.forEach(function(element){
    var cnt = 0;
    for(var i =0;i<time_label.length;i++)
        if(time_label[i]==element)
            cnt++;
    if(cnt==0)
        time_label.push(element);
});
variableJSON.noEyes.forEach(function(element){
    var cnt = 0;
    for(var i =0;i<time_label.length;i++)
        if(time_label[i]==element)
            cnt++;
    if(cnt==0)
        time_label.push(element);
});
variableJSON.yesEyes.forEach(function(element){
    var cnt = 0;
    for(var i =0;i<time_label.length;i++)
        if(time_label[i]==element)
            cnt++;
    if(cnt==0)
        time_label.push(element);
});
console.log(time_label);
time_label.sort();
console.log(time_label);


for(var i =0;i<time_label.length;i++){
    var noFaceCnt,noEyesCnt,yesEyesCnt;
    noFaceCnt = noEyesCnt = yesEyesCnt = 0;
    variableJSON.noFace.forEach(function(element){
        if(time_label[i]==element)
            noFaceCnt++;
    });
    variableJSON.noEyes.forEach(function(element){
        if(time_label[i]==element)
            noEyesCnt++;
    });
    variableJSON.yesEyes.forEach(function(element){
        if(time_label[i]==element)
            yesEyesCnt++;
    });
    
    noFace_data.push(noFaceCnt);
    noEyes_data.push(noEyesCnt);
    yesEyes_data.push(yesEyesCnt);
}



var barChartData = {
    labels: time_label,
    datasets: [{
        label: 'no Face',
        backgroundColor: window.chartColors.red,
        data: noFace_data
    }, {
        label: 'no Eyes',
        backgroundColor: window.chartColors.blue,
        data: noEyes_data
    }, {
        label: 'yes Eyes',
        backgroundColor: window.chartColors.green,
        data: yesEyes_data
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
