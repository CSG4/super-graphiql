const _ = require('lodash');
const bodyParser = require('body-parser');
const axios = require('axios');
const graphql = require('graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQL
} = graphql;

const Student = require('./Models/studentModel');
const Subject = require('./Models/subjectModel');

const SubjectType = new GraphQLObjectType({
  name: 'Subject',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    professor: { type: GraphQLString },
    students: {
      type: new GraphQLList(StudentType),
      resolve(parentValue, args) {
        return Student.find({ subjectId: parentValue.id }, (err, doc) => {
          if (!doc || err) return 'Not Found';
          return doc;
        })
      }
      //   return axios.get(`http://localhost:3000/subjects/${parentValue.id}/students`).then((response) => response.data);
      // }
    }
  })
});

const StudentType = new GraphQLObjectType({
  name: 'Student',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    subject: { 
      type: SubjectType,
      resolve(parentValue, args) {
        return Subject.findOne({ id: parentValue.subjectId }, (err, doc2) => {
          if (!doc2 || err) return 'Not Found';
          return doc2;
        });
        
        // return axios.get(`http://localhost:3000/subjects/${parentValue.subjectId}`).then(response => response.data);
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    student: {
      type: StudentType,
      args: { id: { type: GraphQLInt } }, 
      resolve(parentValue, args) {
        return Student.findOne({ id: args.id }, (err, doc) => {
          if (!doc || err) return 'Not Found';
          return doc;
        })
        // HOW WITHOUT AXIOS???
        // return axios.get(`http://localhost:3000/students/${args.id}`).then((res) => res.data);
      }
    },
    subject: {
      type: SubjectType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return Subject.findOne({ id: args.id }, (err, doc) => {
          if(!doc || err) return 'Not Found';
          return doc;
        })
        // return axios.get(`http://localhost:3000/subjectes/${args.id}`).then((response) => response.data);
      }
    } 
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
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
            if(err|| !doc)  reject('Entry not created');
            resolve(doc);
          });
        })
      }
    }
  }
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation
});

module.exports = schema;