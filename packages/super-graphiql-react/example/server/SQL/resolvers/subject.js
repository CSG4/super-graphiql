module.exports = {
  Query: {
    getSubject: (parent, { id }, { models }) => models.Subject.findOne({ where: { id } }),
    allSubjects: (parent, args, { models }) => models.Subject.findAll(),
  },
  Mutation: {
    createSubject: (parent, args, { models }) => models.Subject.create(args),
  },
};