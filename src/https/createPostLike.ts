import { https, region } from 'firebase-functions'
import { CallableContext } from 'firebase-functions/lib/providers/https'
import { code } from '../constants/code'
import { POSTS } from '../constants/collection'
import { msg } from '../constants/msg'
import { ASIA_NORTHEAST1 } from '../constants/region'
import { CreatePostLikeData } from '../interfaces/https/createPostLikeData'
import { Post } from '../interfaces/models/post/post'
import { createLike } from '../models/like/createLike'
import { switchLike } from '../models/like/switchLike'
import { createId } from '../utils/createId'
import { document } from '../utils/document'
import { getUser } from '../utils/getUser'
import { internalError } from '../utils/internalError'
import { isUndefined } from '../utils/isUndefined'

const handler = async (data: CreatePostLikeData, context: CallableContext) => {
  if (isUndefined(data.postId)) {
    throw new https.HttpsError(code.invalidArgument, msg.notFound('postId'))
  }

  const user = await getUser(context)

  if (!user) {
    throw new https.HttpsError(code.unauthenticated)
  }

  const postSnapshot = await document(POSTS, data.postId).get()

  if (!postSnapshot.exists) {
    throw new https.HttpsError(code.invalidArgument, msg.notFound('post'))
  }

  const post = postSnapshot.data() as Post

  const newLike = createLike({
    id: createId(),
    collectionId: POSTS,
    docId: data.postId,
    docOwnerId: post.ownerId,
    ownerId: user.uid
  })

  try {
    await switchLike(newLike)

    return {}
  } catch (e) {
    throw internalError(e)
  }
}

module.exports = region(ASIA_NORTHEAST1).https.onCall(handler)
