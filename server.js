var request = require('request').defaults({
  'proxy': 'http://proxy.tcs.com:8080'
});
var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.all('/*', function(req, res, next) {
  req.url = req.url.replace("/http", "http");

  delete req.headers["pragma"];
  delete req.headers["host"];
  delete req.headers["origin"];
  delete req.headers["content-length"];
  delete req.headers["referer"];
  delete req.headers["user-agent"];
  delete req.headers["Origin"];

  var options = {
    url: req.url,
    method: req.method,
    headers: req.headers
  };

  if (Object.keys(req.body).length == 0) {
    request(options, onServiceResponse);
  } else {
    console.log(req.headers['content-type']);
    if(req.headers['content-type'] == 'application/x-www-form-urlencoded;charset=UTF-8'){
      request(options, onServiceResponse).form(req.body);
    } else {
      options.json = req.body;
      request(options, onServiceResponse);
    }
  }

  function onServiceResponse(error, response, body) {
    if (typeof response == "undefined") {
      var response = {};
    }
    if (response.statusCode) {
      res.status(response.statusCode);
    }
    if (response.headers) {
      res.set("Content-Type", response.headers["content-type"]);
    } else {
      res.set("Content-Type", "application/json");
    }

    res.send(body);
  }

});

app.listen(3000, function() {
  console.log('App listening on port 3000!')
});
