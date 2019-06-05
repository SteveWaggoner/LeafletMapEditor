// app.ts
import express from 'express';
import bodyParser from 'body-parser';

// Create a new express application instance
const app = express();

/* Database configuration */
import database from './config/dbconfig';

/* Init database */
database.init();

/* Init server listening */
const port = process.argv[2] || 3000;
app.listen(port, function () {
    console.log("Server listening on port : " + port);
});

/* Express configuration */
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/* Router configuration */
const REST_API_ROOT = '/api';
app.use(REST_API_ROOT, require('./routes/router'));

