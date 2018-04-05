const mongoose = require("mongoose");
const myURI = "mongodb://user:pw1@ds113169.mlab.com:13169/graphql-test";
const uri = process.env.MONGO_URI || myURI;
mongoose.connect(uri);
mongoose.connection.once("open", () => {
  console.log("Connected to Database");
});

const graphql = require("graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

const Student = require("./noSQLModels/studentModel");
const Subject = require("./noSQLModels/subjectModel");

const SubjectType = new GraphQLObjectType({
  name: "Subject",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    professor: { type: GraphQLString },
    students: {
      type: new GraphQLList(StudentType),
      resolve(parentValue, args) {
        return Student.find({ subjectId: parentValue.id }, (err, doc) => {
          if (!doc || err) return "Not Found";
          return doc;
        });
      }
    }
  })
});

const StudentType = new GraphQLObjectType({
  name: "Student",
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    subject: {
      type: SubjectType,
      resolve(parentValue, args) {
        return Subject.findOne({ id: parentValue.subjectId }, (err, doc2) => {
          if (!doc2 || err) return "Not Found";
          return doc2;
        });
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    allStudents: {
      type: new GraphQLList(StudentType),
      resolve(parentValue) {
        return Student.find({}, (err, docs) => {
          if (err || !docs) return "No Entry Found";
          return docs;
        });
      }
    },
    student: {
      type: StudentType,
      args: { id: { type: GraphQLInt } },
      resolve(parentValue, args) {
        return Student.findOne({ id: args.id }, (err, doc) => {
          if (!doc || err) return "Not Found";
          return doc;
        });
      }
    },
    allSubjects: {
      type: new GraphQLList(SubjectType),
      resolve(parentValue) {
        return Subject.find({}, (err, docs) => {
          if (err || !docs) return "No Entry Found";
          return docs;
        });
      }
    },
    subject: {
      type: SubjectType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return Subject.findOne({ id: args.id }, (err, doc) => {
          if (!doc || err) return "Not Found";
          return doc;
        });
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addStudent: {
      type: StudentType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) }, //Nonnull means the field is required
        name: { type: GraphQLString },
        subjectId: { type: GraphQLString }
      },
      resolve(parentValue, { id, name, subjectId }) {
        return new Promise((resolve, reject) => {
          Student.create({ id, name, subjectId }, (err, doc) => {
            if (err || !doc) reject("Entry not created");
            resolve(doc);
          });
        });
      }
    },
    removeStudent: {
      type: StudentType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parentValue, { id }) {
        return new Promise((resolve, reject) => {
          Student.findOneAndRemove({ id }, (err, doc) => {
            if (err || !doc) reject("Entry not created");
            resolve(doc);
          });
        });
      }
    },
    addSubject: {
      type: SubjectType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }, //Nonnull means the field is required
        name: { type: GraphQLString },
        professor: { type: GraphQLString }
      },
      resolve(parentValue, { id, name, professor }) {
        return new Promise((resolve, reject) => {
          Subject.create({ id, name, professor }, (err, doc) => {
            if (err || !doc) reject("Entry not created");
            resolve(doc);
          });
        });
      }
    },
    removeSubject: {
      type: SubjectType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { id }) {
        return new Promise((resolve, reject) => {
          Subject.findOneAndRemove({ id }, (err, doc) => {
            if (err || !doc) reject("Entry not created");
            resolve(doc);
          });
        });
      }
    }
  }
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation
});

module.exports = schema;