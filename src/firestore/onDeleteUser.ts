import { firestore } from 'firebase-admin'
import { EventContext, region } from 'firebase-functions'
import { POSTS, USERS } from '../constants/collection'
import { ASIA_NORTHEAST1 } from '../constants/region'
import { collection } from '../utils/collection'
import { createArrayInArray } from '../utils/createArrayInArray'

const path = `${USERS}/{userId}`

const handler = async (
  _: firestore.DocumentSnapshot,
  context: EventContext
) => {
  const { userId } = context.params

  const posts = await collection(USERS, userId, POSTS).get()

  for (const postSnapshotsArray of createArrayInArray(posts.docs)) {
    const batch = firestore().batch()

    for (const postSnapshots of postSnapshotsArray) {
      batch.delete(postSnapshots.ref)
    }

    await batch.commit()
  }
}

module.exports = region(ASIA_NORTHEAST1)
  .firestore.document(path)
  .onDelete(handler)
