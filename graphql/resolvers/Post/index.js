import User from "../../../server/models/User";
import Post from "../../../server/models/Post";
import Comment from "../../../server/models/Comment";
import Category from "../../../server/models/Category";

export default {
  Query: {
    post: async (parent, { _id }, context, info) => {
      return await Post.findById({ _id }).exec();
    },
    posts: async (parent, { skip, count, orderBy }, context, info) => {
      let posts = await Post.find({}).populate().exec();

      if (orderBy) {
        posts = posts.sort((a, b) => {
          if (orderBy.direction === "ASC") {
            return a[orderBy.field].toString().localeCompare(b[orderBy.field].toString());
          } else if (orderBy.direction === "DESC") {
            return b[orderBy.field].toString().localeCompare(a[orderBy.field].toString());
          }
        });
      }

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
        details: `${u.details.substring(0, 320)}...`,
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

      const posts = await Post.find({ categories: category }).populate().exec();

      if (!posts.length) {
        throw new Error('Posts not found.')
      }

      return posts.map(u => ({
        _id: u._id.toString(),
        slug: u.slug,
        author: u.author,
        title: u.title,
        details: `${u.details.substring(0, 320)}...`,
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

      return await new Promise((resolve, reject) => {
        newPost.save((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
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
        const post = await Post.findById(_id);
        const comments = await Comment.find({_id: post.comments}).exec();
        if (comments) {
          comments.forEach(comment => {
            Comment.findByIdAndDelete(comment._id).exec();
          })
        }
        
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
    comments: async ({ _id }, args, context, info) => {
      return await Comment.find({ post: _id });
    },
    categories: async ({ categories }, args, context, info) => {
      return await Category.find({ _id: categories });
    },
  }
};
