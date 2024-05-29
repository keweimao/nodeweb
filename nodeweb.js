// import { username, password, authDatabase, databaseName } from './auth.js'; 
const { username, password, authDatabase, databaseName } = require('./auth_example.js');

// Express setup
var express = require('express');
var app = express();
const port = 9636;

// Connection URL to MongoDB
const { MongoClient } = require('mongodb');
const url = `mongodb://${username}:${password}@tux-mongo.cci.drexel.edu:27017/${databaseName}?authSource=${authDatabase}`;

// Web Application Entry
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
            res.send('Hello, ' + name);
            console.log(result ? result.name : 'No document found');
            client.close();
        });
    });
    
});

// Find students in a specific program
app.get('/students', function (req, res) {
    const program = req.query.program; 
    MongoClient.connect(url, (err, client) => {
        if (err) {
            console.error('Error connecting to MongoDB:', err);
            res.send(JSON.stringify({
                status: 500, 
                students: []
            }));
            return;
        }

        const dbo = client.db(databaseName);

        dbo.collection('students').find({"program":program}).toArray((err, students) => {
            if (err) {
                console.error('Error finding document:', err);
                res.send(JSON.stringify({
                    status: 404, 
                    students: []
                }));
                return;
            }
            res.send(JSON.stringify({
                status: 200, 
                students: students
            }));
            console.log(result ? result.name : 'No document found');
            client.close();
        });
    });
    
});

var server = app.listen(port, function () {
   console.log("Express App running at port " + port + "/");
});
