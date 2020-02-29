var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/hello', function(req, res, next) {
  res.send('world');
});


/* GET home page. */
router.post('/', function(req, res, next) {
  console.log(111111);
  var request = require('request');
  //  Basic Authentication credentials   
  var username = "admin"; 
  var password = "passw0rd";
  console.log(111111);
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

module.exports = router;
