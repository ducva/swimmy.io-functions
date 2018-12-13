import { firestore, storage } from 'firebase-admin'
import { region } from 'firebase-functions'
import { FILES } from '../constants/collection'
import { ASIA_NORTHEAST1 } from '../constants/region'
import { File } from '../interfaces/models/file/file'

const path = `${FILES}/{fileId}`

const handler = async (snapshot: firestore.DocumentSnapshot) => {
  const file = snapshot.data() as File

  await storage()
    .bucket(file.bucketName)
    .file(file.filePath)
    .delete()
}

module.exports = region(ASIA_NORTHEAST1)
  .firestore.document(path)
  .onDelete(handler)
