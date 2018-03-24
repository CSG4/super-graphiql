const express = require("express");
const app = express();
const graphqlHTTP = require("express-graphql");
const { graphql } = require("graphql");
const schema = require("./graphql-schema");
const studentController = require("./Controllers/studentController");
const subjectController = require("./Controllers/subjectController");
const bodyParser = require("body-parser");
const path = require("path");

const mongoose = require("mongoose");
const myURI = "mongodb://user:pw1@ds113169.mlab.com:13169/graphql-test";
const uri = process.env.MONGO_URI || myURI;
mongoose.connect(uri);
mongoose.connection.once("open", () => {
  console.log("Connected to Database");
});
//

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/*/graphiql.css", (req, res) => {
  res.sendFile(path.join(__dirname, "./../../graphiql.css"));
});

app.use(express.static(__dirname + "./../"));

//------ To test database using Postman ------//

app.use("/newStudent", studentController.addStudent);
app.use("/removeStudent", studentController.rmStudent);
app.use("/newSubject", subjectController.addSubject);
app.use("/removeSubject", subjectController.rmSubject);

//------ Original GraphiQL implementation can be seen at route /graphql ------//

app.use("/graphiql", graphqlHTTP({ schema, graphiql: true }));

//------ To test your GraphQL schema/server using Postman ------//

// A get request to retrieve the result of a query using HTTP, via a query string
app.get("/get", (req, res) => {
  let { query } = req.query;
  graphql(schema, query).then(response => {
    res.send(response);
  });
});

// A post request to retrieve the resutl of a query using HTTP, via specifying the query in a json in the body of the message
app.use("/graphql", (req, res) => {
  let queryObj = {
    schema, 
    source: req.body.query.toString()
  }

  if (req.body.variables) {
    queryObj['variableValues'] = JSON.parse(req.body.variables);
  }

  graphql(queryObj).then(response => {
    res.send(response);
  });
});

app.listen(8000, () => {
  console.log("listening on 8000");
});
