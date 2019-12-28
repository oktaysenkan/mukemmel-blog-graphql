export default `
  type Comment {
    _id: ID!
    post: Post!
    name: String!
    content: String!
    verified: String!
    creationAt: String!
  }

  type Query {
    comment(_id: ID!): [Comment!]!
    comments(skip: Int, count: Int): [Comment!]!
  }

  type Mutation {
    createComment(comment: CreateCommentInput!): Comment!
    updateComment(_id: ID!, comment: UpdateCommentInput): Comment!
    deleteComment(_id: ID!): Comment!
  }

  type Subscription {
    comment(postId: ID!): CommentSubscriptionPayload!
  }

  type CommentSubscriptionPayload {
    mutation: MutationType!
    comment: Comment!
  }

  input CreateCommentInput {
    post: ID!
    name: String!
    content: String!
  }
  
  input UpdateCommentInput {
    name: String
    content: String
    verified: String
  }

  enum MutationType {
    CREATED
    DELETED
    UPDATED
  }
`;
