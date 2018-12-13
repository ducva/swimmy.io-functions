import { Post } from '../../interfaces/models/post/post'
import { PostObject } from '../../interfaces/models/post/postObject'
import { systemFieldsForAlgolia } from '../../utils/systemFieldsForAlgolia'

export const createPostObject = (root: Post): PostObject => {
  return {
    ...root,
    ...systemFieldsForAlgolia(root),
    ownerId: null
  }
}
