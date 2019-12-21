import User from "../../../server/models/User";
import Post from "../../../server/models/Post";
import Comment from "../../../server/models/Comment";

import { transformPost } from "../merge";

export default {
  Query: {
    post: async (parent, { _id }, context, info) => {
      return await Post.findOne({ _id }).exec();
    },
    posts: async (parent, args, context, info) => {
      const res = await Post.find({})
        .populate()
        .exec();

      return res.map(u => ({
        _id: u._id.toString(),
        slug: u.slug,
        author: u.author,
        title: u.title,
        details: u.details,
        image: u.image,
        views: u.views,
        comments: u.comments,
        creationAt: u.creationAt,
      }));
    }
  },
  Mutation: {
    createPost: async (parent, { post }, context, info) => {
      const newPost = await new Post({
        slug: post.slug,
        author: post.author,
        title: post.title,
        details: post.details,
        image: post.image,
      });
      let createdPost;
      try {
        // const result = await newPost.save();
        const result = await new Promise((resolve, reject) => {
         newPost.save((err, res) => {
            err ? reject(err) : resolve(res);
          });
        });
        createdPost = transformPost(result);
        const creator = await User.findById(post.author);

        if (!creator) {
          throw new Error("User not found.");
        }
        console.log(createdPost);
        
        creator.posts.push(newPost);
        await creator.save();
        return createdPost;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    updatePost: async (parent, { _id, post }, context, info) => {
      return new Promise((resolve, reject) => {
        Post.findByIdAndUpdate(_id, { $set: { ...post } }, { new: true }).exec(
          (err, res) => {
            err ? reject(err) : resolve(res);
          }
        );
      });
    },
    deletePost: async (parent, { _id }, context, info) => {
      try {
        // searching for creator of the post and deleting it from the list
        const post = await Post.findById(_id);
        const creator = await User.findById(post.author);
        if (!creator) {
          throw new Error("User not found.");
        }
        const index = creator.posts.indexOf(_id);
        if (index > -1) {
          creator.posts.splice(index, 1);
        }
        await creator.save();
        return new Promise((resolve, reject) => {
          Post.findByIdAndDelete(_id).exec((err, res) => {
            err ? reject(err) : resolve(res);
          });
        });
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  },
  Subscription: {
    post: {
      subscribe: (parent, args, { pubsub }) => {
        //return pubsub.asyncIterator(channel)
      }
    }
  },
  Post: {
    author: async ({ author }, args, context, info) => {
      return await User.findById(author);
    },
    comments: async ({ author }, args, context, info) => {
      return await Comment.find({ author });
    }
  }
};
