const express = require('express');
const app = express();
const graphqlHTTP = require('express-graphql');
const { graphql } = require('graphql')
const schema = require('./graphql-schema');
const studentController = require('./Controllers/studentController');
const subjectController = require('./Controllers/subjectController');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const myURI = 'mongodb://user:pw1@ds113169.mlab.com:13169/graphql-test';
const uri = process.env.MONGO_URI || myURI;
mongoose.connect(uri);
mongoose.connection.once('open', () => {
  console.log('Connected to Database');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/newStudent', studentController.addStudent);
app.use('/removeStudent', studentController.rmStudent);
app.use('/editStudent', studentController.rmStudent);
app.use('/newSubject', subjectController.addSubject);
app.use('/removeSubject', subjectController.rmSubject);
app.use('/editSubject', subjectController.rmSubject);

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

// A get request to retrieve the result of a query using HTTP, via a query string
app.get('/hello', (req, res) => {
  let { query } = req.query;
  graphql(schema, query).then((response) => {
    res.send(response);
  });
});

// A post request to retrieve the resutl of a query using HTTP, via specifying the query in a json in the body of the message
app.use('/hello', (req, res) => {
  graphql(schema, req.body.query.toString()).then((response) => {
    res.send(response);
  });
});

app.listen(8000, () => { console.log('listening on 8000') });