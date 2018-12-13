import { Post } from '../interfaces/models/post/post'

export const isNotPostAsAnonym = (post: Post): boolean => {
  if (post.replyPostId) {
    return false
  }

  if (!post.ownerId) {
    return false
  }

  return true
}
