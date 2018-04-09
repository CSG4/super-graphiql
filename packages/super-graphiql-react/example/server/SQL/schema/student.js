module.exports = `

  type Student {
    id: Int!
    name: String!
    lastname: String!
    subjects: [Subject]
  }
  type Query {
    getStudent(id: Int!): Student!
    allStudents: [Student!]!
  }
  type Mutation {
    createStudent(name: String!, lastname: String!): Student!
  }

`;