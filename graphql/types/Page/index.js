export default `
  type Page {
    _id: ID!
    slug: String!
    name: String!
    content: String!
  }

  type Query {
    page(_id: ID!): Page!
    pages(skip: Int, count: Int): [Page!]!
    pageBySlug(slug: String!): Page!
  }

  type Mutation {
    createPage(page: CreatePageInput): Page!
    updatePage(_id: ID!, page: UpdatePageInput): Page!
    deletePage(_id: ID!): Page!
  }

  input CreatePageInput {
    title: String!
    slug: String!
    name: String!
    content: String!
  }
  
  input UpdatePageInput {
    title: String
    slug: String
    name: String
    content: String
  }

  enum MutationType {
    CREATED
    DELETED
    UPDATED
  }
`;
