export default `
  type Post {
    _id: ID!
    slug: String!
    author: User!
    title: String!
    details: String!
    image: String!
    views: Int
    comments: [Comment!]!
    categories: [Category!]!
    creationAt: String
  }

  type Query {
    post(_id: ID!): Post!
    posts(skip: Int, count: Int, orderBy: OrderPostInput): [Post!]!
    postsByCategory(categorySlug: String!): [Post!]!
    postBySlug(slug: String!): Post!
  }

  type Mutation {
    createPost(post: CreatePostInput): Post!
    updatePost(_id: ID!, post: UpdatePostInput): Post!
    deletePost(_id: ID!): Post!
  }

  type Subscription {
    post: PostSubscriptionPayload!
  }

  type PostSubscriptionPayload {
    mutation: MutationType!
    post: Post!
  }

  input CreatePostInput {
    title: String!
    slug: String!
    author: ID!
    details: String!
    categories: [ID]!
    image: String!
  }
  
  input UpdatePostInput {
    title: String
    slug: String
    details: String
    image: String
    views: Int
    creationAt: String
    categories: [ID]
  }

  input OrderPostInput {
    field: String!
    direction: String!
  }

  enum MutationType {
    CREATED
    DELETED
    UPDATED
  }
`;
