var express = require('express');
var app = express();
var db = require('pg');

var NODE_ENV = require('./constants');
var DATABASES = require('./constants');

app.get('/accessDoor', function(req, res) {
  accessDoor(req, res);
});

let ALLOWED_NAME = 'Joe';

app.post('/updateAllowedName', function(req, res) {
  if (req.query.newName) {
    ALLOWED_NAME = req.query.newName;
    return res.json({STATUS: 'success'});
  } else {
    res.send('Error occured: ' +
    "'newName' param is missing or invalid");
    throw new Error();
  }
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});

const accessDoor = (req, res) => {
  const allowedName = ALLOWED_NAME; // this can be changed when

  const validate = () => {
    if (req.query && req.query.id && req.query.name === allowedName) {
      return true;
    }
    return false;
  };

  if (validate()) {
    var dbClient;
    var dataBase;

    if (process.env.NODE_ENV === NODE_ENV.LOCAL) {
      dataBase = DATABASES.testDatabase;
    } else if (process.env.NODE_ENV === NODE_ENV.STAGING) {
      dataBase = DATABASES.stagingDatabase;
    } else if (process.env.NODE_ENV === NODE_ENV.PRODUCTION) {
      dataBase = DATABASES.productionDatabase;
    }

    // http://localhost:3000/accessDoor?id=1&name=Joe

    dbClient = new db.Client(dataBase);
    dbClient.query(
      'insert into entry_history values(' +
      req.query.id +
      ',' +
      new Date() +
      ')',
    );

    res.send('Success: Granted access to door for id: ' + req.query.id);
  } else {
    res.send('Error occured: ' +
    "'id' or 'name' parameter missing/invalid or 'name' does not match.");
    throw new Error();
  }
};
module.exports = accessDoor;
