var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/hello', function(req, res, next) {
  res.send('world');
});

var request = require('request');

/* post get token. */
router.post('/', function(req, res, next) {
  
  //  Basic Authentication credentials   
  var username = "admin"; 
  var password = "passw0rd";
  const buf = Buffer.from(username + ":" + password, 'ascii');
  var authenticationHeader = "Basic " + buf.toString('base64');
  console.log(authenticationHeader);
  request(   
  {
    url : "https://192.168.0.101/api/v2/tokens/",
    rejectUnauthorized: false,
    method: "POST",
    headers : { "Authorization" : authenticationHeader, "Content-type": "application/json" }  
    },
    function (error, response, body) {
      console.log(body);
      res.json(JSON.parse(body));

    }  

  );  
});



/* Post get wf jobs */
router.post('/wfjobs', function(req, res, next) {
  
  //get token
  console.log(req);
  console.log(req.body.tokenInfo);
  token = req.body.tokenInfo.token;
  request(   
    {
      url : "https://192.168.0.101/api/v2/workflow_jobs/",
      rejectUnauthorized: false,
      method: "GET",
      headers : { "Authorization" : "Bearer "+token, "Content-type": "application/json" }  
      },
      function (error, response, body) {
        console.log(body);
        var x=JSON.parse(body);
        res.status(200).send(x);
  
      }  
  
    );  
//    res.status(200).send({result:"123"});
});

module.exports = router;
