const joinMonster = require('join-monster');
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const SUBJECT_ADDED = 'SUBJECT_ADDED';

module.exports = {
  Subscription: {
    subjectAdded: {
      subscribe: () => {
        return pubsub.asyncIterator(SUBJECT_ADDED)
      },
    },
  },
  
  Query: {
    allSubjects: (parent, args, { models }, info) =>
      joinMonster.default(info, args, sql =>
        models.sequelize.query(sql, { type: models.sequelize.QueryTypes.SELECT }),
      ),
    getSubject: (parent, args, { models }, info) =>
      joinMonster.default(info, args, sql =>
        models.sequelize.query(sql, { type: models.sequelize.QueryTypes.SELECT }),
      ),
  },

  Mutation: {
    deleteSubject: (parent, args, { models }) => models.Subject.destroy({ where: args }),
    createSubject: async (parent, args, { models }) => {
      const subject = await models.Subject.create(args);
      pubsub.publish(SUBJECT_ADDED, { subjectAdded: {name: args.name, teacher: args.teacher} });
      return {
        ...subject.dataValues,
        subjects: [],
      };
    },
  },
  
};