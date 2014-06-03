/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , nforce = require('nforce');
var util  = require('util');

var callbackHandler = require('./routes/callbackHandler');

var userName = 'hsharma@makepositive.demo';
var pw = 'Demo@1234';

var fnRouter  = require('./routes/piRouter')
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.engine('html', require('ejs').renderFile);
 // app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Server listening on port " + app.get('port'));
});


var socket = require('./routes/socket');
var io = require('socket.io').listen(server,{ log: false });

app.get('/', routes.index);
app.get('/pinState', fnRouter.getPinstate);
app.get('/blink', fnRouter.blink);
app.post('/turnOn/', fnRouter.turnON);
app.post('/turnOff/', fnRouter.turnOff);
app.post('/read/', fnRouter.readState);
app.post('/blinkpattern/', fnRouter.blinkPattern);


var org;
var oauth;

createConnection();

var intrvl = setInterval(maintainSession,899999);

function createConnection(){

  console.log('creating Session');

  try{
    org = nforce.createConnection({
      clientId: '3MVG9WtWSKUDG.x7pYh6FzvXs4Kk8WBnmLK_7oYb.jYmdFg_TubiYbaXscm7vOjH1JhAsaTbIFeQpt9khvN.g',
      clientSecret: '7743812832139289352',
      redirectUri: 'http://localhost:3000/oauth/_callback',
      apiVersion: 'v29.0',  // optional, defaults to current salesforce API version
      environment: 'production',  // optional, salesforce 'sandbox' or 'production', production default
      mode: 'single' // optional, 'single' or 'multi' user mode, multi default
    });

  createSession();

  } catch (ex) {
    console.log(ex);
    createConnection();
  }
}

//funciton to keep the session alive

function maintainSession(){

  try{

    console.log('Maintaining Session');

    var q = 'SELECT Id, Name, CreatedDate, BillingCity FROM Account LIMIT 1';

    org.query({ query: q }, function(err, resp){
      if(err) console.log(err);
    });

  } catch (ex) {
    console.log(ex);
    createSession();
  }


}

function createSession(){
    org.authenticate({ username: userName, password: pw }, function(err, oauth) {

    if(err) {
       console.log(err);
       createConnection();
    } else {
      oauth = this.oauth;
      bindStreaming();
    }

  });
}


function bindStreaming() {

try {  

    console.log('Binding to the streaming API');
    // subscribe to a pushtopic
    var str = org.stream({ topic: 'Interface', oauth: oauth });

    str.on('connect', function(){
      console.log('connected to pushtopic');
    });

    str.on('error', function(error) {
      console.log('error: ' + error);
      createConnection();
    });

    str.on('data', function(data) {
      console.log('Value Changed');
      callbackHandler.index(data,streamingParseErrorListner);
    });

  } catch (ex) {
    console.log(ex);
    createSession();
  } 
}

function streamingParseErrorListner(){
  clearInterval(intrvl);
  createConnection();
  intrvl = setInterval(createSession,899999);
}


socket.socket(io);