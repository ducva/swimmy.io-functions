import { https, region } from 'firebase-functions'
import { code } from '../constants/code'
import { CHANGELOGS } from '../constants/collection'
import { msg } from '../constants/msg'
import { ASIA_NORTHEAST1 } from '../constants/region'
import { DeleteChangelog } from '../interfaces/https/deleteChangelog'
import { document } from '../utils/document'
import { getUserId } from '../utils/getUserId'
import { internalError } from '../utils/internalError'
import { isUndefined } from '../utils/isUndefined'

const handler = async (
  data: DeleteChangelog,
  context: https.CallableContext
): Promise<null> => {
  if (isUndefined(data.changelogId)) {
    throw new https.HttpsError(
      code.invalidArgument,
      msg.notFound('changelogId')
    )
  }

  const uid = getUserId(context)

  if (!uid) {
    throw new https.HttpsError(code.unauthenticated)
  }

  if (uid !== 'nM3s6pYpDa6qykNzK') {
    throw new https.HttpsError(code.permissionDenied)
  }

  try {
    await document(CHANGELOGS, data.changelogId).delete()
  } catch (e) {
    throw internalError(e)
  }

  return null
}

module.exports = region(ASIA_NORTHEAST1).https.onCall(handler)
