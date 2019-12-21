import User from "../../../server/models/User";
import Post from "../../../server/models/Post";

export default {
  Query: {
    user: async (parent, { _id }, context, info) => {
      return await User.findOne({ _id }).exec();
    },
    users: async (parent, { skip, count }, context, info) => {
      let users = await User.find({})
        .populate()
        .exec();

      if (skip) {
        users = users.splice(skip, users.length);
      }

      if (count) {
        users = users.splice(0, count);
      } else {
        users = users.splice(0, 10);
      }
      
      if (!users.length) {
        throw new Error('Users not found.')
      }

      return users.map(u => ({
        _id: u._id.toString(),
        fullName: u.fullName,
        posts: u.posts,
      }));
    }
  },
  Mutation: {
    createUser: async (parent, { user }, context, info) => {
      const newUser = await new User({
        fullName: user.fullName,
      });

      return new Promise((resolve, reject) => {
        newUser.save((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    },
    updateUser: async (parent, { _id, user }, context, info) => {
      return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(_id, { $set: { ...user } }, { new: true }).exec(
          (err, res) => {
            err ? reject(err) : resolve(res);
          }
        );
      });
    },
    deleteUser: async (parent, { _id }, context, info) => {
      return new Promise((resolve, reject) => {
        User.findByIdAndDelete(_id).exec((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    }
  },
  User: {
    posts: async ({ _id }, args, context, info) => {
      return await Post.find({ author: _id });
    }
  }
};
