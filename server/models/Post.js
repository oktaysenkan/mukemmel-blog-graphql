import mongoose from "mongoose";
import { ObjectID } from "mongodb";
var moment = require('moment');

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function() {
  return this.toString();
};

const PostSchema = new Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category"
    }
  ],
  creationAt: {
    type: Date,
    default: moment.utc().valueOf()
  },
});

export default mongoose.model("Post", PostSchema);
