import Category from "../../../server/models/Category";

export default {
  Query: {
    category: async (parent, { _id }, context, info) => {
      return await Category.findById({ _id });
    },
    categories: async (parent, { skip, count }, context, info) => {
      let categories = await Category.find({}).populate().exec();
      
      if (skip) {
        categories = categories.splice(skip, categories.length);
      }

      if (count) {
        categories = categories.splice(0, count);
      } else {
        categories = categories.splice(0, 10);
      }
      
      if (!categories.length) {
        throw new Error('Categories not found.')
      }

      return categories.map(u => ({
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
};
