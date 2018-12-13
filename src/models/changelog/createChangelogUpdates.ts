import { firestore } from 'firebase-admin'
import { ChangelogUpdates } from '../../interfaces/models/changelog/changelogUpdates'

interface Input {
  contents: string[]
  date: firestore.Timestamp
}

export const createChangelogUpdates = (input: Input): ChangelogUpdates => {
  const now = firestore.Timestamp.now()

  return {
    contents: input.contents,
    date: input.date,
    updatedAt: now
  }
}
