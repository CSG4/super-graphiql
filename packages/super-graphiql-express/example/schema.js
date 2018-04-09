const mongoose = require("mongoose");
const myURI = "mongodb://user:pw1@ds113169.mlab.com:13169/graphql-test";
const uri = process.env.MONGO_URI || myURI;
mongoose.connect(uri);
mongoose.connection.once("open", () => {
  console.log("Connected to Database");
});

const makeExecutableSchema = require("graphql-tools").makeExecutableSchema;
const resolvers = require("./resolvers");

const typeDefs = `
	type Subject {
		id: String,
		name: String,
    professor: String,
    students: [Student]
	}

	type Student {
		id: Int,
    name: String
    subjects: [Subject!]!
	}

	type Query {
    getStudent(id: Int!): Student
    getSubject(id: String!): Subject
		allStudents(last: Int): [Student!]!
		allSubjects(last: String): [Subject!]!
	}

	type Mutation {
		addStudent(name: String!, id: Int!, subjects: String): Student
    addSubject(name: String!, professor: String!, id: String!, students: String): [Subject]
    removeStudent(id: Int!): Student
    removeSubject(id: String!): [Subject]
	}

	type Subscription {
		studentAdded: Student,
		subjectAdded: Subject
	}
`;

// The type definitions are compiled to an executable GraphQL schema
// by the makeExecutableSchema function from graphql-tools
const schema = makeExecutableSchema({ typeDefs, resolvers });
module.exports = schema;