import { firestore } from 'firebase-admin'
import { region } from 'firebase-functions'
import { IMAGES } from '../constants/collection'
import { ASIA_NORTHEAST1 } from '../constants/region'
import { deleteImageURL } from '../helpers/deleteImageURL'
import { Image } from '../interfaces/models/image/image'

const path = `${IMAGES}/{imageId}`

const handler = async (snapshot: firestore.DocumentSnapshot) => {
  const image = snapshot.data() as Image

  await deleteImageURL(image.bucketName, image.filePath)
}

export = region(ASIA_NORTHEAST1)
  .firestore.document(path)
  .onDelete(handler)
