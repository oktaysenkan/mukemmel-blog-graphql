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
    createdAt: String
  }

  type Query {
    post(_id: ID!): Post!
    posts: [Post!]!
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
    createdAt: String
    categories: [ID]
  }

  enum MutationType {
    CREATED
    DELETED
    UPDATED
  }
`;
