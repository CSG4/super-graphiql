/* eslint-disable */

const joinMonsterJoins = {
  Query: {
    fields: {
      getStudent: {
        where: (table, empty, args) => `${table}.id = ${args.id}`,
      },
      getSubject: {
        where: (table, empty, args) => `${table}.id = ${args.id}`,
      },
    },
  },
  Student: {
    sqlTable: 'students',
    uniqueKey: 'id',
    fields: {
      subjects: {
        junction: {
          sqlTable: '"classes"',
          include: {
            primary: {
              sqlColumn: 'primary',
            },
          },
          sqlJoins: [
            (studentTable, junctionTable, args) => `${studentTable}.id = ${junctionTable}.student_id`,
            (junctionTable, subjectTable, args) => `${junctionTable}.subject_id = ${subjectTable}.id`
          ],
        },
      },
    },
  },
  Subject: {
    sqlTable: 'subjects',
    uniqueKey: 'id',
    fields: {
      students: {
        junction: {
          sqlTable: '"classes"',
          include: {
            primary: {
              sqlColumn: 'primary',
            },
          },
          sqlJoins: [
            (subjectTable, junctionTable, args) => `${subjectTable}.id = ${junctionTable}.subject_id`,
            (junctionTable, studentTable, args) => `${junctionTable}.student_id = ${studentTable}.id`
          ],
        },
      },
    },
  },
};

module.exports = joinMonsterJoins;