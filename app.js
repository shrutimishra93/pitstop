var express = require('express');
var app = express();
var pg = require('pg');

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
  console.log('AccessDoor app listening on port 3000!');
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
    var dataBase;

    if (process.env.NODE_ENV === NODE_ENV.LOCAL) {
      dataBase = DATABASES.testDatabase;
    } else if (process.env.NODE_ENV === NODE_ENV.STAGING) {
      dataBase = DATABASES.stagingDatabase;
    } else if (process.env.NODE_ENV === NODE_ENV.PRODUCTION) {
      dataBase = DATABASES.productionDatabase;
    }

    // http://localhost:3000/accessDoor?id=1&name=Joe

    var pool = new pg.Pool(dataBase);

    // const pg = require('pg');
    // const pool = new pg.Pool({
    //   user: 'sysadmin',
    //   host: '127.0.0.1',
    //   database: 'mywebstore',
    //   password: '123',
    //   port: '5432',
    // });

    // pool.query('SELECT NOW()', (err, res) => {
    //   console.log(err, res);
    //   pool.end();
    // });

    pool.connect(function (err, client, done) {
      if (err) {
        console.log('error');
        console.log(err);
      } else {
        console.log('pg started');
        var query_get_value = 'insert into entry_history values(' +
        req.query.id + ',' + new Date() + ')';
        client.query(query_get_value, function (err) {
          done();
          if (err) {
            throw err;
          }
        });
      }
    });

    console.log('inserted');

    res.send('Success: Granted access to door for id: ' + req.query.id);
  } else {
    res.send('Error occured: ' +
    "'id' or 'name' parameter missing/invalid or 'name' does not match.");
    throw new Error();
  }
};
module.exports = accessDoor;
