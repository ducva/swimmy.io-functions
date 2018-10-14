import { Post } from "../interfaces/models/post/post";

export const isPostAsThread = (post: Post): boolean => {
  return post.replyPostCount > 0;
};
