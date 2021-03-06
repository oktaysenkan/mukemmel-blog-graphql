export default `
  type Category {
    _id: ID!
    name: String!
    slug: String!
    posts: [Post!]!
  }

  type Query {
    category(_id: ID!): [Category!]!
    categories(skip: Int, count: Int): [Category!]!
  }

  type Mutation {
    createCategory(category: CreateCategoryInput!): Category!
    updateCategory(_id: ID!, category: UpdateCategoryInput): Category!
    deleteCategory(_id: ID!): Category!
  }

  input CreateCategoryInput {
    name: String!
    slug: String!
  }
  
  input UpdateCategoryInput {
    name: String!
    slug: String!
  }

  enum MutationType {
    CREATED
    DELETED
    UPDATED
  }
`;
