const Student = require("./../Models/studentModel");
const Subject = require("./../Models/subjectModel");

module.exports = {
  Query: {
    Student: id => {
      return Student.findOne({ id: id }, (err, docs) => {
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
    Subject: id => {
      return Subject.findOne({ id: id }, (err, docs) => {
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
      return Student.create(newStudent, (err, docs) => {
        if (err) {
          console.log(err);
        }
        return docs;
      });
    },
    addSubject: (root, args) => {
      const newSubject = {
        id: args.id,
        name: args.name,
        professor: args.professor,
        students: args.students
      };
      return Subject.create(newSubject, (err, docs) => {
        if (err) {
          console.log(err);
        }
        return docs;
      });
    }
  }
};
