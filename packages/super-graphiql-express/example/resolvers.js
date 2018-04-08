const Student = require("./Models/studentModel");
const Subject = require("./Models/subjectModel");

// We construct an instance of PubSub to handle the subscription topics for our application using PubSub from graphql-subscriptions
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const STUDENT_ADDED_TOPIC = "newStudent";
const SUBJECT_ADDED_TOPIC = "newSubject";

module.exports = {
  Query: {
    getStudent: (root, args) => {
      return Student.findOne({ id: args.id }, (err, docs) => {
        if (err) {
          console.log(err);
        }
        return docs;
      });
    },
    allStudents: () => {
      return Student.find((err, docs) => {
        if (err) {
          console.log(err);
        }
        return docs;
      });
    },
    getSubject: (root, args) => {
      return Subject.findOne({ id: args.id }, (err, docs) => {
        if (err) {
          console.log(err);
        }
        return docs;
      });
    },
    allSubjects: () => {
      return Subject.find({}, (err, docs) => {
        if (err) {
          console.log(err);
        }
        return docs;
      });
    }
  },

  Mutation: {
    addStudent: (root, args) => {
      const newStudent = {
        id: args.id,
        name: args.name,
        subjects: args.subjects
      };
      return new Promise((resolve, reject) => {
        Student.create(newStudent, (err, docs) => {
          if (err) {
            reject(err);
          }
          // Publish the new student to the newStudent topic; it will then be received by clients that are subscribed to this topic
          pubsub.publish(STUDENT_ADDED_TOPIC, { studentAdded: docs });
          resolve(docs);
        });
      });
    },
    removeStudent: (parentValue, { id }) => {
      return new Promise((resolve, reject) => {
        Student.findOneAndRemove({ id }, (err, doc) => {
          if (err || !doc) {
            reject("Student not found");
          }
          resolve(doc);
        });
      });
    },
    addSubject: (root, args) => {
      const newSubject = {
        id: args.id,
        name: args.name,
        professor: args.professor,
        students: args.students
      };
      return new Promise((resolve, reject) => {
        Subject.create(newSubject, (err, doc) => {
          if (err || !doc) {
            reject("Subject not created");
          }
          Subject.find({}, (err, docs) => {
            if (err || !docs) {
              reject("No subjects found");
            }
            pubsub.publish(SUBJECT_ADDED_TOPIC, { subjectAdded: docs });
            resolve(docs);
          });
        });
      });
    },
    removeSubject: (parentValue, { id }) => {
      return new Promise((resolve, reject) => {
        Subject.findOneAndRemove({ id }, (err, doc) => {
          if (err || !doc) {
            reject("Subject not found nor removed");
          }
          Subject.find({}, (err, docs) => {
            if (err || !docs) {
              reject("No subjects found");
            }
            resolve(docs)
          });
        });
      });
    },
  },

  Subscription: {
    // the value is an object, not a function as with queries and mutations
    // object has a subscribe key, whose value is the resolver method
    // the "subscribe" resolver must return an AsyncIterator
    // An async iterator is much like an iterator, except that its next() method returns a promise for a { value, done } pair
    // More on iterators: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
    // we are using the asyncIterator provided by the PubSub instance
    studentAdded: {
      subscribe: () => pubsub.asyncIterator(STUDENT_ADDED_TOPIC)
    },
    subjectAdded: {
      subscribe: () => pubsub.asyncIterator(SUBJECT_ADDED_TOPIC)
    }
  }
};