import { mergeResolvers } from "merge-graphql-schemas";

import User from "./User/";
import Post from "./Post/";
import Comment from "./Comment/";
import Category from "./Category";

const resolvers = [User, Post, Comment, Category];

export default mergeResolvers(resolvers);
