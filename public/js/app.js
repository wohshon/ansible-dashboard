var App = {
    log: function(msg) {
        console.log(msg);
    },
    tokenInfo: null,
    getToken: function(callback) {
        //check if there is a token
        var isExpiredToken = true;
        if (this.tokenInfo) {
            //check for validity
            //workaround, should validate using pub key
            var dateNow = new Date();
            if(this.tokenInfo.expires < dateNow.getTime()/1000)

            {
                isExpiredToken = true;
            }
            console.log("token is expired:"+isExpiredToken);
        }
        if (isExpiredToken || this.tokenInfo == null) {
            $.ajax({
                url : "/backend",
                  dataType : "json",
                  headers: { "Content-Type":"application/json","Accept": "application/json","Authorization": "Basic YWRtaW46cGFzc3cwcmQ=" },
                  type : 'POST',
                  contentType: "application/json",
                  success : function (data) {
                    console.log(data);
                    console.log(data.token);
                    this.tokenInfo=data;
                    console.log("got token "+this.tokenInfo.token);
                    callback(this.tokenInfo);
                    //var jwt = require('jsonwebtoken');
                    //jwt.verify()        
    
                    //console.log("number or records "+Object.keys(data));
                    //console.log("number or records "+JSON.parse(data).count);
                  },
                  error : function (data, errorThrown) {
                    alert(errorThrown);
                  }
              });
        }

    },
    workFlowJobInfo: null,
    getWFJobs: function(tokenInfo) {
    console.log("getting wf jobs");
    console.log("token "+tokenInfo);
    $.ajax({
        url : "/backend/wfjobs",
            headers: { },
            type : 'POST',
            data: JSON.stringify({tokenInfo: tokenInfo}),
            dataType: "json",
            contentType: "application/json",
            success : function (data) {
                console.log(data);
                this.workFlowJobInfo=data;
                console.log("number of jobs "+data.count);
                
                myChart.processData(data, myChart.initChart);
                
            },
            error : function (data, errorThrown) {
                //alert(Object.keys(data));
                alert(data.responseText);
            }
        });
    }

} ;


var myChart = {
    log: function(msg) {
        console.log(msg);
    },
    processData: function(inputData,callback) {
        console.log(inputData.results);
        var results = inputData.results;
        let statusResult = results.map(a => a.status);
        console.log(statusResult);

        //console.log(statusResult.filter(x => x === 'failed').length);  // -> 3

        const distinctStatus=[...new Set(statusResult)];
        
        console.log(distinctStatus);
        var countArray=[];
        var i=0;
        distinctStatus.forEach(function (item) {
            countArray[i]=statusResult.filter(x => x === item).length;
            i++;
        });
        console.log(countArray);
        console.log(this.data.datasets[0].data);
        //console.log(this.data.labels);
        this.data.datasets[0].data=countArray;
        this.data.labels=distinctStatus;
        console.log(this.data.datasets[0].data);
        //status
        console.log('calling callback');
        callback();
    },
    data: {
        datasets: [{
            data: [10, 20, 30],
//            backgroundColor:["rgb(255, 99, 132)","rgb(54, 162, 235)","rgb(255, 205, 86)"],
            backgroundColor:["rgb(255, 99, 132)","rgb(54, 162, 235)"],
            borderWidth: 2,
            weight: 10
        }],
  
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Red',
            'Yellow',
            'Blue'
        ]
      },
      options : {
        animation: { 
          animateRotate	: true
        },
        maintainAspectRatio: false,
        cutoutPercentage: 80,
        legend: {
              labels: {
                  // This more specific font property overrides the global property
                  fontColor: 'black',
                  fontSize: 24
              }
          }      
      },    
      initChart: function() {
          
        window.doughnutChart = new Chart(myChart.ctx, {
            type: 'doughnut',
            data: myChart.data,
            options: myChart.options
        });

        
        $( "#myChart" ).click(function(event) {
            console.log( "Handler for .click() called."+Object.keys(event) );
            var activePoints =  window.doughnutChart.getElementsAtEvent(event);
            console.log(activePoints[0]);
            if (activePoints[0]) {
                var chartData = activePoints[0]['_chart'].config.data;
                var idx = activePoints[0]['_index'];
       
                var label = chartData.labels[idx];
                var value = chartData.datasets[0].data[idx];
                var color = chartData.datasets[0].backgroundColor[idx]; //Or any other data you wish to take from the clicked slice
                //console.log(window.doughnutChart);
                //console.log(window.doughnutChart instanceof Chart);
                window.doughnutChart.destroy();
                //window.doughnutChart=null;
                //console.log(window.doughnutChart+ '' +myChart.ctx);
                //console.log(window.doughnutChart instanceof Chart);
                myChart.options.cutoutPercentage=0;
                window.doughnutChart = new Chart(myChart.ctx, {
                    type: 'pie',
                    data: myChart.data,
                    options: myChart.options
                });
                window.doughnutChart.update();
                //console.log(window.doughnutChart);
                //console.log(window.doughnutChart+ ' new ' +myChart.ctx);
       
                console.log(idx+' '+label + ' ' + value + ' ' + color); //Or any other function you want to execute. I sent the data to the server, and used the response i got from the server to create a new chart in a Bootstrap modal.
                //myChart = null;

              }            
          });        
      },
      ctx: null
} ;