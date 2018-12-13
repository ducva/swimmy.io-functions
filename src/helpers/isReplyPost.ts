import { Post } from '../interfaces/models/post/post'

export const isReplyPost = (post: Post): boolean => {
  return post.replyPostId !== null
}
