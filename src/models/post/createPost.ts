import { Post } from '../../interfaces/models/post/post'
import { Owner } from '../../interfaces/models/shared/owner'
import { systemFields } from '../../utils/systemFIelds'

interface Input {
  fileIds: string[]
  text: string
  replyPostId: string
  photoURLs: string[]
  postId: string
  owner: Owner | null
  ownerId: string | null
}

export const createPost = (input: Input): Post => {
  return {
    ...systemFields(input.postId),
    fileIds: input.fileIds,
    text: input.text,
    ownerId: input.ownerId,
    owner: null,
    replyPostCount: 0,
    replyPostId: input.replyPostId || null,
    photoURLs: input.photoURLs,
    likeCount: 0
  }
}
