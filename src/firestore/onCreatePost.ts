import { firestore } from 'firebase-admin'
import { EventContext, region } from 'firebase-functions'
import { POSTS, POSTS_AS_IMAGE, STATS, USERS } from '../constants/collection'
import { ASIA_NORTHEAST1 } from '../constants/region'
import { createIndex } from '../helpers/createIndex'
import { isNotPostAsAnonym } from '../helpers/isNotPostAsAnonym'
import { isPostAsImage } from '../helpers/isPostAsImage'
import { Post } from '../interfaces/models/post/post'
import { Stat } from '../interfaces/models/stat/stat'
import { createPostAsAnonym } from '../models/post/createPostAsAnonym'
import { createPostObject } from '../models/post/createPostObject'
import { createStat } from '../models/stats/createStat'
import { collection } from '../utils/collection'
import { createId } from '../utils/createId'
import { document } from '../utils/document'

const path = `${POSTS}/{postId}`

const handler = async (
  snapshot: firestore.DocumentSnapshot,
  context: EventContext
) => {
  const post = snapshot.data() as Post
  const { postId } = context.params

  const postAsAnonymous = createPostAsAnonym(post)

  // If this has replyPostId, Update replyPostCount of posts/{postId}

  if (post.replyPostId) {
    await firestore().runTransaction(async t => {
      if (post.replyPostId === null) {
        return
      }

      const repliedPostRef = document(POSTS, post.replyPostId)

      const repliedPostSnapshot = await t.get(repliedPostRef)

      if (!repliedPostSnapshot.exists) return

      const repliedPost = repliedPostSnapshot.data() as Post

      t.update(repliedPostRef, {
        replyPostCount: repliedPost.replyPostCount + 1,
        updatedAt: firestore.Timestamp.now()
      })
    })
  }

  // If this has owner, replicate this in users/{userId}/posts/{postId}

  if (isNotPostAsAnonym(post)) {
    if (post.ownerId) {
      document(USERS, post.ownerId, POSTS, postId).set(postAsAnonymous)
    }
  }

  // If this has an photoURL, replicate this in posts-as-images/{postId}

  if (isPostAsImage(post)) {
    await document(POSTS_AS_IMAGE, postId).set(postAsAnonymous)
    const index = createIndex(POSTS_AS_IMAGE)
    if (index) {
      const postObject = createPostObject(post)
      await index.saveObject(postObject)
    }
  }

  // Update stats

  const newStat = createStat({ statId: createId(), timestamp: post.createdAt })

  await firestore().runTransaction(async t => {
    const statsRef = collection(STATS).where('time', '==', newStat.time)
    const stats = await t.get(statsRef)
    if (stats.empty) {
      const statRef = document(STATS, newStat.id)
      await t.set(statRef, newStat)
    } else {
      const statSnapshot = stats.docs[0]
      const statRef = document(STATS, statSnapshot.id)
      const stat = statSnapshot.data() as Stat
      await t.update(statRef, { postCount: stat.postCount + 1 })
    }
  })
}

module.exports = region(ASIA_NORTHEAST1)
  .firestore.document(path)
  .onCreate(handler)
