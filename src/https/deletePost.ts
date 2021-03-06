import { firestore } from 'firebase-admin'
import { https, region } from 'firebase-functions'
import { code } from '../constants/code'
import { POSTS, POSTS_AS_ANONYM } from '../constants/collection'
import { msg } from '../constants/msg'
import { ASIA_NORTHEAST1 } from '../constants/region'
import { DeletePostData } from '../interfaces/https/deletePostData'
import { Post } from '../interfaces/models/post/post'
import { collection } from '../utils/collection'
import { document } from '../utils/document'
import { getUser } from '../utils/getUser'

const handler = async (
  data: DeletePostData,
  context: https.CallableContext
) => {
  const startTime = Date.now()

  if (!data.postId) {
    throw new https.HttpsError(code.invalidArgument, msg.notFound('postId'))
  }

  const owner = getUser(context)

  if (!owner) {
    throw new https.HttpsError(code.unauthenticated)
  }

  const postId = data.postId

  const postSnapshot = await document(POSTS, postId).get()

  if (!postSnapshot.exists) {
    throw new https.HttpsError(code.invalidArgument, msg.notFound('post'))
  }

  const post = postSnapshot.data() as Post

  if (post.ownerId !== owner.uid) {
    throw new https.HttpsError(code.permissionDenied)
  }

  await document(POSTS, postId).delete()

  if (post.replyPostId) {
    await document(POSTS_AS_ANONYM, post.replyPostId, POSTS, postId).delete()
  }

  if (!post.replyPostId) {
    const replyPosts = await collection(POSTS_AS_ANONYM, postId, POSTS).get()

    if (!replyPosts.empty) {
      const batch = firestore().batch()

      for (const replyPostSnapshot of replyPosts.docs) {
        batch.delete(replyPostSnapshot.ref)
      }

      await batch.commit()
    }

    await document(POSTS_AS_ANONYM, postId).delete()
  }

  const time = Date.now() - startTime

  return { time, data: { post } }
}

module.exports = region(ASIA_NORTHEAST1).https.onCall(handler)
