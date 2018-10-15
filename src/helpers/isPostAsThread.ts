import { Post } from "../interfaces/models/post/post";

export const isPostAsThread = (post: Post): boolean => {
  return post.photoURLs.length === 0 && post.replyPostCount > 0;
};
