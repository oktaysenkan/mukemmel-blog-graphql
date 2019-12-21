import { mergeResolvers } from "merge-graphql-schemas";

import User from "./User/";
import Post from "./Post/";
import Comment from "./Comment/";
import Category from "./Category";
import Page from "./Page";

const resolvers = [User, Post, Comment, Category, Page];

export default mergeResolvers(resolvers);
