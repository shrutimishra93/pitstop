var express = require('express')
var accessDoor = express()

accessDoor.get('/', function (req, res) {
    res.send('Hello World');
});

accessDoor.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

var db = require("pg");
var testDatabase = {
    user: "user",
    password: "password",
    host: "localhost",
    database: 'staging',
    port: 5432,
};
let stagingDatabase = {
    user: "user",
    password: "password",
    host: "localhost",
    database: 'staging',
    port: 5432,
};
var productionDatabase = {
    user: "user",
    password: "password",
    host: "localhost",
    database: 'staging',
    port: 5432,
};
PROCEED = undefined;

function accessDoor(req, res) {
    var validation = true;
    const allowedName = "Joe"; // this can be changed when
    function validate() {
        if (req.params.id == true) { // must have id in request
            validation = true;
        } else {
            validation = false;
        }
        if (req.params.name != allowedName) validation = false;
        PROCEED = validation;
    }
    validate();
    if (PROCEED == true) {
        var a;
        if (process.env.NODE_ENV == "local") {
            a = new db.Client(testDatabase);
        }
        if (process.env.NODE_ENV == "staging") {
            a = new db.Client(stagingDatabase);
        }
        if (process.env.NODE_ENV == "production") {
            a = new db.Client(productionDatabase);
        }
        a.query("insert into entry_history values(" + req.params.id + "," + new Date() + ')');

            res.send();
    }
    else {
        throw new Error()
    }
}
module.exports = accessDoor