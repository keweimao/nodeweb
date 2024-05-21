var express = require('express');
var app = express();
const port = 9636;

const { MongoClient } = require('mongodb');

const username = 'wk77';
const password = 'dee4JaeL-oSau5Kai-eeG0AuF6';
const authDatabase = 'wk77_INFO153_202103';
const databaseName = 'wk77_INFO153_202103';
const url = `mongodb://${username}:${password}@tux-mongo.cci.drexel.edu:27017/${databaseName}?authSource=${authDatabase}`;



app.get('/', function (req, res) {
    var name = "unknown";
    MongoClient.connect(url, (err, client) => {
        if (err) {
            console.error('Error connecting to MongoDB:', err);
            res.send('Sorry, error connecting to MongoDB.');
            return;
        }

        const dbo = client.db(databaseName);

        dbo.collection('students').findOne({}, (err, result) => {
            if (err) {
                console.error('Error finding document:', err);
                res.send('Sorry, error finding document.');
                return;
            }
            name = result.name; 
            res.send('Hello World, ' + name);
            console.log(result ? result.name : 'No document found');
            client.close();
        });
    });
    
});

var server = app.listen(port, function () {
   console.log("Express App running at port " + port + "/");
});