import Page from "../../../server/models/Page";

export default {
  Query: {
    page: async (parent, { _id }, context, info) => {
      return await Page.findOne({ _id }).exec();
    },
    pages: async (parent, { skip, count }, context, info) => {
      let pages = await Page.find({}).populate().exec();

      if (skip) {
        pages = pages.splice(skip, pages.length);
      }

      if (count) {
        pages = pages.splice(0, count);
      } else {
        pages = pages.splice(0, 10);
      }
      
      if (!pages.length) {
        throw new Error('Pages not found.')
      }

      return pages.map(u => ({
        _id: u._id.toString(),
        name: u.name,
        slug: u.slug,
        content: u.content,
      }));
    }
  },
  Mutation: {
    createPage: async (parent, { page }, context, info) => {
      const newPage = await new Page({
        name: page.name,
        slug: page.slug,
        content: page.content,
      });

      return new Promise((resolve, reject) => {
        newPage.save((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    },
    updatePage: async (parent, { _id, page }, context, info) => {
      return new Promise((resolve, reject) => {
        Page.findByIdAndUpdate(_id, { $set: { ...page } }, { new: true }).exec(
          (err, res) => {
            err ? reject(err) : resolve(res);
          }
        );
      });
    },
    deletePage: async (parent, { _id }, context, info) => {
      return new Promise((resolve, reject) => {
        Page.findByIdAndDelete(_id).exec((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    }
  }
};
