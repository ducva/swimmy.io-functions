import { Post } from '../../interfaces/models/post/post'

export const createPostAsAnonym = (post: Post) => {
  const newPost = post

  newPost.ownerId = post.owner ? post.ownerId : null

  return newPost
}
