const makeExecutableSchema = require("graphql-tools").makeExecutableSchema;
const resolvers = require("./resolvers");

const typeDefs = `
	type Subject {
		id: Int,
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
    Student(id: Int!): Student
    Subject(id: Int!): Subject
		allStudents(last: Int): [Student!]!
		allSubjects(last: Int): [Subject!]!
	}

	type Mutation {
		addStudent(name: String!, id: Int!, subjects: String): Student
		addSubject(name: String!, professor: String!, id: Int!, students: String): Subject
	}
`;

// The type definitions are compiled to an executable GraphQL schema
// by the makeExecutableSchema function from graphql-tools
const schema = makeExecutableSchema({ typeDefs, resolvers });
module.exports = schema;
