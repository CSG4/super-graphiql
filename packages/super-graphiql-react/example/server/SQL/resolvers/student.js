const joinMonster = require('join-monster');
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const STUDENT_ADDED = 'STUDENT_ADDED';

module.exports = {
  Subscription: {
    studentAdded: {
      subscribe: () => {
        return pubsub.asyncIterator(STUDENT_ADDED)
      },
    },
  },
  
  Query: {
    allStudents: (parent, args, { models }, info) =>
      joinMonster.default(info, args, sql =>
        models.sequelize.query(sql, { type: models.sequelize.QueryTypes.SELECT }),
      ),
    getStudent: (parent, args, { models }, info) =>
      joinMonster.default(info, args, sql =>
        models.sequelize.query(sql, { type: models.sequelize.QueryTypes.SELECT }),
      ),
  },

  Mutation: {
    deleteStudent: (parent, args, { models }) => models.Student.destroy({ where: args }),
    createStudent: async (parent, args, { models }) => {
      const student = await models.Student.create(args);
      pubsub.publish(STUDENT_ADDED, { studentAdded: {name: args.name, lastname: args.lastname} });
      return {
        ...student.dataValues,
        subjects: [],
      };
    },
  },

};