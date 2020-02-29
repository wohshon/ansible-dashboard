var App = {
    log: function(msg) {
        console.log(msg);
    },
    tokenInfo: null,
    getToken: function() {
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
                //var jwt = require('jsonwebtoken');
                //jwt.verify()
                var isExpiredToken = false;

                var dateNow = new Date();

                if(this.tokenInfo.expires < dateNow.getTime()/1000)

                {
                    isExpiredToken = true;
                }
                console.log(isExpiredToken);
                //console.log("number or records "+Object.keys(data));
                //console.log("number or records "+JSON.parse(data).count);
              },
              error : function (data, errorThrown) {
                alert(3);
              }
          });        
    }
} ;


var myChart = {
    log: function(msg) {
        console.log(msg);
    },
    data: {
        datasets: [{
            data: [10, 20, 30],
            backgroundColor:["rgb(255, 99, 132)","rgb(54, 162, 235)","rgb(255, 205, 86)"],
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
                  fontSize: 20
              }
          }      
      },    
      initChart: function(ctx) {

        doughnutChart = new Chart(ctx, {
            type: 'doughnut',
            data: this.data,
            options: this.options
          });
      
      },
      doughnutChart: null
} ;