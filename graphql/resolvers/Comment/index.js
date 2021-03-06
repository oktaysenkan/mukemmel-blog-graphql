import Post from "../../../server/models/Post";
import Comment from "../../../server/models/Comment";

export default {
  Query: {
    comment: async (parent, { _id }, context, info) => {
      return await Comment.findById({ _id });
    },
    comments: async (parent, { skip, count }, context, info) => {
      let comments = await Comment.find({}).populate().exec();

      if (skip) {
        comments = comments.splice(skip, comments.length);
      }

      if (count) {
        comments = comments.splice(0, count);
      } else {
        comments = comments.splice(0, 10);
      }
      
      if (!comments.length) {
        throw new Error('Comments not found.')
      }

      return comments.map(u => ({
        _id: u._id.toString(),
        post: u.post,
        name: u.name,
        content: u.content,
        verified: u.verified,
        creationAt: u.creationAt,
      }));
    }
  },
  Mutation: {
    createComment: async (parent, { comment }, context, info) => {
      const newComment = await new Comment({
        post: comment.post,
        name: comment.name,
        content: comment.content,
        verified: comment.verified,
        creationAt: comment.creationAt,
      });

      try {
        const post = await Post.findById(comment.post);

        if (!post) {
          throw new Error("Post not found.");
        }

        return new Promise((resolve, reject) => {
          newComment.save((err, res) => {
            err ? reject(err) : resolve(res);
          });
        });
      } catch (error) {
        throw error
      }
    },
    updateComment: async (parent, { _id, comment }, context, info) => {
      return new Promise((resolve, reject) => {
        Comment.findByIdAndUpdate(
          _id,
          { $set: { ...comment } },
          { new: true }
        ).exec((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    },
    deleteComment: async (parent, { _id }, context, info) => {
      return new Promise((resolve, reject) => {
        Comment.findByIdAndDelete(_id).exec((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    }
  },
  Subscription: {
    comment: {
      subscribe: (parent, args, { pubsub }) => {
        //return pubsub.asyncIterator(channel)
      }
    }
  },
  Comment: {
    post: async ({ post }, args, context, info) => {
      return await Post.findById(post);
    }
  }
};
