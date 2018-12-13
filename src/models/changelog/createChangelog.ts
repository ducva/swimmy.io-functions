import { firestore } from 'firebase-admin'
import { Changelog } from '../../interfaces/models/changelog/changelog'
import { systemFields } from '../../utils/systemFIelds'

interface Input {
  changelogId: string
  date: firestore.Timestamp
  contents: string[]
  version: number
}

export const createChangelog = (input: Input): Changelog => {
  return {
    ...systemFields(input.changelogId),
    contents: input.contents,
    date: input.date,
    version: input.version
  }
}
