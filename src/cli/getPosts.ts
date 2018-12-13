import { credential, firestore, initializeApp } from 'firebase-admin'
import serviceAccount from '../../service-account.json'
import { POSTS } from '../constants/collection'
import { collection } from '../utils/collection'

const main = async () => {
  initializeApp({ credential: credential.cert(serviceAccount) })

  firestore().settings({ timestampsInSnapshots: true })

  const posts = await collection(POSTS).get()

  console.log('length', posts.docs.length)
}

main().catch(err => {
  console.error(err)
})
