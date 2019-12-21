import Category from "../../../server/models/Category";

export default {
  Query: {
    category: async (parent, { _id }, context, info) => {
      return await Category.find({ _id });
    },
    categories: async (parent, args, context, info) => {
      const res = await Category.find({})
        .populate()
        .exec();

      return res.map(u => ({
        _id: u._id.toString(),
        slug: u.slug,
        name: u.name,
      }));
    }
  },
  Mutation: {
    createCategory: async (parent, { category }, context, info) => {
      const newCategory = await new Category({
        slug: category.slug,
        name: category.name,
      });

      return new Promise((resolve, reject) => {
        newCategory.save((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    },
    updateCategory: async (parent, { _id, category }, context, info) => {
      return new Promise((resolve, reject) => {
        Category.findByIdAndUpdate(
          _id,
          { $set: { ...category } },
          { new: true }
        ).exec((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    },
    deleteCategory: async (parent, { _id }, context, info) => {
      return new Promise((resolve, reject) => {
        Category.findByIdAndDelete(_id).exec((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    }
  },
  Subscription: {
    category: {
      subscribe: (parent, args, { pubsub }) => {
        //return pubsub.asyncIterator(channel)
      }
    }
  }
};
