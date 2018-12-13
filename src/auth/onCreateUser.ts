import { auth } from 'firebase-admin'
import { region } from 'firebase-functions'
import { USERS } from '../constants/collection'
import { ASIA_NORTHEAST1 } from '../constants/region'
import { createUser } from '../models/user/createUser'
import { document } from '../utils/document'

const handler = async (userRecord: auth.UserRecord) => {
  const isSwUser = !!userRecord.email.includes('@swimmy.io')

  const user = createUser({
    userId: userRecord.uid,
    username: isSwUser
      ? userRecord.email.replace('@swimmy.io', '')
      : userRecord.uid
  })

  await document(USERS, userRecord.uid).set(user)
}

export = region(ASIA_NORTHEAST1)
  .auth.user()
  .onCreate(handler)
