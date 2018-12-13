import { firestore } from 'firebase-admin'
import { EventContext, region } from 'firebase-functions'
import {
  FILES,
  POSTS,
  POSTS_AS_IMAGE,
  POSTS_AS_THREAD,
  STATS,
  USERS
} from '../constants/collection'
import { createIndex } from '../helpers/createIndex'
import { isNotPostAsAnonym } from '../helpers/isNotPostAsAnonym'
import { isPostAsImage } from '../helpers/isPostAsImage'
import { isPostAsThread } from '../helpers/isPostAsThread'
import { Post } from '../interfaces/models/post/post'
import { Stat } from '../interfaces/models/stat/stat'
import { createStat } from '../models/stats/createStat'
import { collection } from '../utils/collection'
import { createId } from '../utils/createId'
import { document } from '../utils/document'

const path = `${POSTS}/{postId}`

const handler = async (
  snapshot: firestore.DocumentSnapshot,
  context: EventContext
): Promise<void> => {
  const post = snapshot.data() as Post
  const { postId } = context.params

  for (let fileId of post.fileIds) {
    await document(FILES, fileId).delete()
  }

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
        replyPostCount: repliedPost.replyPostCount - 1
      })
    })
  }

  if (isNotPostAsAnonym(post)) {
    if (post.ownerId) {
      document(USERS, post.ownerId, POSTS, postId).delete()
    }
  }

  if (isPostAsThread(post)) {
    await document(POSTS_AS_THREAD, postId).delete()
    const index = createIndex(POSTS_AS_THREAD)
    if (index) {
      await index.deleteObject(postId)
    }
  }

  if (isPostAsImage(post)) {
    await document(POSTS_AS_IMAGE, postId).delete()
    const index = createIndex(POSTS_AS_IMAGE)
    if (index) {
      await index.deleteObject(postId)
    }
  }

  const newStat = createStat({ statId: createId(), timestamp: post.createdAt })

  await firestore().runTransaction(async t => {
    const statsRef = collection(STATS).where('time', '==', newStat.time)
    const stats = await t.get(statsRef)
    if (stats.empty) {
      throw new Error('found empty stats!')
    } else {
      const statSnapshot = stats.docs[0]
      const statRef = document(STATS, statSnapshot.id)
      const stat = statSnapshot.data() as Stat
      await t.update(statRef, { postCount: stat.postCount - 1 })
    }
  })
}

export = region('asia-northeast1')
  .firestore.document(path)
  .onDelete(handler)
