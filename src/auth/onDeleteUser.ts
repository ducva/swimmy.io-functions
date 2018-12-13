import { auth } from 'firebase-admin'
import { region } from 'firebase-functions'
import { USERS } from '../constants/collection'
import { ASIA_NORTHEAST1 } from '../constants/region'
import { document } from '../utils/document'

const handler = async (userRecord: auth.UserRecord) => {
  await document(USERS, userRecord.uid).delete()
}

export = region(ASIA_NORTHEAST1)
  .auth.user()
  .onDelete(handler)
