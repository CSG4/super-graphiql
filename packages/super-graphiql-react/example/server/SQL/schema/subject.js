module.exports = `
  type Subject {
    id: Int!
    name: String!
    teacher: String!
    students: [Student]
  }

  type Query {
    getSubject(id: Int!): Subject!
    allSubjects: [Subject!]!
  }

  type Mutation {
    createSubject(name: String!, teacher: String!): Subject!
    deleteSubject(id: Int!): Subject!
  }

  type Subscription {
    subjectAdded: Subject!
  }
  `;