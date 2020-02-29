var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //this is for the pug template
//  res.render('index', { title: 'Express' });
  //this is for the index.html
  res.render('index.html', { title: 'Express' });
});

module.exports = router;
