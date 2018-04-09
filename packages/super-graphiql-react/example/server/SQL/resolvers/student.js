module.exports = {
  Query: {
    getStudent: (parent, { id }, { models }) => models.Student.findOne({ where: { id } }),
    allStudents: (parent, args, { models }) => models.Student.findAll(),
  },
  Mutation: {
    createStudent: (parent, args, { models }) => models.Student.create(args),
  },
};