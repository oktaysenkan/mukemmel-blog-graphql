export default `
  type User {
    _id: String!
    fullName: String!
    posts: [Post!]!
  }

  type Query {
    user(_id: ID!): User!
    users: [User!]!
  }

  type Mutation {
    createUser(user: CreateUserInput): User!
    updateUser(_id: String!, user: UpdateUserInput!): User!
    deleteUser(_id: String!): User!
  }

  input CreateUserInput {
    fullName: String!
  }
  
  input UpdateUserInput {
    fullName: String
  } 
`;
