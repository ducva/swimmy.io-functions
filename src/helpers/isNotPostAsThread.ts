import { Post } from '../interfaces/models/post/post'

export const isNotPostAsThread = (post: Post): boolean => {
  if (post.replyPostId) {
    return false
  }

  return post.replyPostCount === 0
}
