import { Post } from "../interfaces/models/post/post";

export const isPostAsImage = (post: Post): boolean => {
  return Boolean(post.fileIds.length);
};
