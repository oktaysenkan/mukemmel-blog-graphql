import mongoose from "mongoose";
import { ObjectID } from "mongodb";
var moment = require('moment');

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function() {
  return this.toString();
};

const CommentSchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
  name: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  creationAt: {
    type: Date,
    default: moment.utc().valueOf()
  },
});

export default mongoose.model("Comment", CommentSchema);
