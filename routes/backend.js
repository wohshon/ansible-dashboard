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
        writetoES(x);
        res.status(200).send(x);
  
      }  
  
    );  
//    res.status(200).send({result:"123"});
});
const { Client } = require('elasticsearch');
const client = new Client({ hosts:['http://192.168.0.110:9200'] })

function writetoES(data) {
  //only get the jobs array
  jobs = data.results;

  console.log(jobs);
  //bulk?
    jobs.forEach(element => {
      async function run () {
        await client.index({
        index: "ansible-wfjobs",
        type: "_doc",
        id: element.id,
        body: {
          workflow_job_template: element.workflow_job_template,
          status: element.status,
          name: element.name,
          launch_type: element.launch_type,
          id: element.id,
          type: element.type,
          finished: element.finished,
          related: {
            workflow_nodes: element.related.workflow_nodes,
            created_by: element.related.created_by,
            modified_by: element.related.modified_by
          },
          summary_fields: {
            inventory: element.summary_fields.inventory
          }
        }
      })
      await client.indices.refresh({ index: 'ansible-wfjobs' })

    }
    run().catch(console.log); 
  });
}
module.exports = router;
