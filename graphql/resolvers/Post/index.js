import User from "../../../server/models/User";
import Post from "../../../server/models/Post";
import Comment from "../../../server/models/Comment";
import Category from "../../../server/models/Category";

import { transformPost } from "../merge";

export default {
  Query: {
    post: async (parent, { _id }, context, info) => {
      return await Post.findById({ _id }).exec();
    },
    posts: async (parent, { skip, count }, context, info) => {
      let posts = await Post.find({}).populate().exec();

      if (skip) {
        posts = posts.splice(skip, posts.length);
      }

      if (count) {
        posts = posts.splice(0, count);
      } else {
        posts = posts.splice(0, 10);
      }

      if (!posts.length) {
        throw new Error('Posts not found.')
      }

      return posts.map(u => ({
        _id: u._id.toString(),
        slug: u.slug,
        author: u.author,
        title: u.title,
        details: u.details,
        image: u.image,
        views: u.views,
        comments: u.comments,
        categories: u.categories,
        creationAt: u.creationAt,
      }));
    },
    postsByCategory: async (parent, { categorySlug }, context, info) => {
      const category = await Category.findOne({slug: categorySlug});

      if (!category) {
        throw new Error("Category not found.");
      }

      const post = await Post.find({ categories: category })
        .populate()
        .exec();

      return post.map(u => ({
        _id: u._id.toString(),
        slug: u.slug,
        author: u.author,
        title: u.title,
        details: u.details,
        image: u.image,
        views: u.views,
        comments: u.comments,
        categories: u.categories,
        creationAt: u.creationAt,
      }));
    },
    postBySlug: async (parent, { slug }, context, info) => {
      const post = await Post.findOne({ slug: slug }).exec();

      if (!post) {
        throw new Error('Post not found.')
      }

      return post;
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
        categories: post.categories
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
        const creatorIndex = creator.posts.indexOf(_id);
        if (creatorIndex > -1) {
          creator.posts.splice(creatorIndex, 1);
        }
        await creator.save();

        const comment = await User.findById(post.comment);
        if (!comment) {
          throw new Error("Comment not found.");
        }
        const commentPostIndex = comment.posts.indexOf(_id);
        if (commentPostIndex > -1) {
          comment.posts.splice(commentPostIndex, 1);
        }
        await comment.save();
        
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
    comments: async ({ comment }, args, context, info) => {
      return await Comment.find({ comment });
    },
    categories: async ({ categories }, args, context, info) => {
      return await Category.find({ _id: categories });
    },
  }
};
