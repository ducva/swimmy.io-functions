import { Post } from '../interfaces/models/post/post'

export const isPostAsImage = (post: Post): boolean => {
  if (post.replyPostId) {
    return false
  }

  return post.fileIds.length > 0
}
