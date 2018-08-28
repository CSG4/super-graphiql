module.exports = {
  Mutation: {
    addClass: async (parent, args, { models }) => {
      await models.Class.create(args);
      return true;
    },
  },
  
};