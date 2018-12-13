import { region } from 'firebase-functions'
import { ObjectMetadata } from 'firebase-functions/lib/providers/storage'
import { FILES, IMAGES } from '../constants/collection'
import { ASIA_NORTHEAST1 } from '../constants/region'
import { createImageURL } from '../helpers/createImageURL'
import { createFile } from '../models/file/createFile'
import { createImage } from '../models/image/createImage'
import { document } from '../utils/document'
import { toFileName } from '../utils/toFileName'

const handler = async (object: ObjectMetadata) => {
  if (typeof object.name !== 'string') {
    throw new Error('object.name not found')
  }

  const imageURL = await createImageURL(object.name)

  const imageId = toFileName(object.name)

  const image = createImage({
    id: imageId,
    imageURL,
    bucketName: object.bucket,
    filePath: object.name
  })

  await document(IMAGES, imageId).set(image)

  const fileId = toFileName(object.name)

  const file = createFile({
    id: fileId,
    bucketName: object.bucket,
    contentType: object.contentType as string,
    filePath: object.name,
    size: Number(object.size)
  })

  await document(FILES, fileId).set(file)
}

export = region(ASIA_NORTHEAST1)
  .storage.object()
  .onFinalize(handler)
