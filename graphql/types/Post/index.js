export default `
  type Post {
    _id: ID!
    slug: String!
    author: User!
    title: String!
    details: String!
    image: String!
    comments: [Comment!]!
    createdAt: String
  }

  type Query {
    post(_id: ID!): Post!
    posts: [Post!]!
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
    image: String!
    createdAt: String!
  }
  
  input UpdatePostInput {
    title: String
    slug: String
    details: String
    image: String
    createdAt: String
  }

  enum MutationType {
    CREATED
    DELETED
    UPDATED
  }
`;
