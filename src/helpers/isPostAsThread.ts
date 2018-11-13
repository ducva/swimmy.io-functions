import { Post } from "../interfaces/models/post/post";

export const isPostAsThread = (post: Post): boolean => {
  if (post.replyPostId) {
    return false;
  }

  if (post.photoURLs.length !== 0) {
    return false;
  }

  return post.replyPostCount > 0;
};
