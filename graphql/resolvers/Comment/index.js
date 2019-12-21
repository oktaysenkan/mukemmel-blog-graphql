import Post from "../../../server/models/Post";
import Comment from "../../../server/models/Comment";

export default {
  Query: {
    comment: async (parent, { _id }, context, info) => {
      return await Comment.find({ _id });
    },
    comments: async (parent, { skip, count }, context, info) => {
      let comments = await Comment.find({})
        .populate()
        .exec();

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
        name: u.name,
        email: u.email,
        content: u.content,
        website: u.website,
        email: u.email,
        verified: u.verified,
      }));
    }
  },
  Mutation: {
    createComment: async (parent, { comment }, context, info) => {
      const newComment = await new Comment({
        post: comment.post,
        name: comment.name,
        email: comment.email,
        content: comment.content,
        website: comment.website,
        email: comment.email,
        verified: comment.verified,
      });

      try {
        const result = new Promise((resolve, reject) => {
          newComment.save((err, res) => {
            err ? reject(err) : resolve(res);
          });
        });
  
        const post = await Post.findById(comment.post);

        if (!post) {
          throw new Error("Post not found.");
        }
        
        post.comments.push(newComment);
        await post.save();
        return result
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
      const comment = await Comment.findById(_id);
      const post = await Post.findById(comment.post);
      if (!post) {
        throw new Error("Post not found.");
      }
      const index = post.comments.indexOf(_id);
      if (index > -1) {
        post.comments.splice(index, 1);
      }
      await post.save();
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
      return await Post.findById({ _id: post });
    }
  }
};
