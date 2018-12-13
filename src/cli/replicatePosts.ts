import { credential, firestore, initializeApp } from 'firebase-admin'
import serviceAccount from '../../service-account.json'
import { POSTS, POSTS_AS_IMAGE, POSTS_AS_THREAD } from '../constants/collection'
import { createIndex } from '../helpers/createIndex'
import { isPostAsImage } from '../helpers/isPostAsImage'
import { isPostAsThread } from '../helpers/isPostAsThread'
import { Post } from '../interfaces/models/post/post'
import { PostObject } from '../interfaces/models/post/postObject'
import { createPostObject } from '../models/post/createPostObject'
import { collection } from '../utils/collection'
import { createArrayInArray } from '../utils/createArrayInArray'

const main = async () => {
  const { ALGOLIA_ID, ALGOLIA_KEY } = process.env

  if (!ALGOLIA_ID) {
    throw new Error('ALGOLIA_ID not found')
  }

  if (!ALGOLIA_KEY) {
    throw new Error('ALGOLIA_KEY not found')
  }

  initializeApp({ credential: credential.cert(serviceAccount) })

  firestore().settings({ timestampsInSnapshots: true })

  const posts = await collection(POSTS).get()

  const postsAsThread: PostObject[] = []
  const postsAsImage: PostObject[] = []

  for (const doc of posts.docs) {
    const post = doc.data() as Post
    const postObject = createPostObject(post)
    if (isPostAsThread(post)) {
      postsAsThread.push(postObject)
    } else if (isPostAsImage(post)) {
      postsAsImage.push(postObject)
    }
  }

  const algoliaConfig = { id: ALGOLIA_ID, key: ALGOLIA_KEY }

  let i = 0

  for (const postsArray of createArrayInArray(postsAsThread, 100)) {
    console.log(`${i++ * 100}/${postsAsThread.length}`)
    const index = createIndex(POSTS_AS_THREAD, algoliaConfig)
    if (index) {
      await index.saveObjects(postsArray)
    }
  }

  for (const postsArray of createArrayInArray(postsAsImage, 100)) {
    console.log(`${i++ * 100}/${postsAsImage.length}`)
    const index = createIndex(POSTS_AS_IMAGE, algoliaConfig)
    if (index) {
      await index.saveObjects(postsArray)
    }
  }
}

main().catch(err => {
  console.error(err)
})
