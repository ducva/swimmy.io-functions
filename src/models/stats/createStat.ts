import { firestore } from 'firebase-admin'
import { Stat } from '../../interfaces/models/stat/stat'
import { systemFields } from '../../utils/systemFIelds'

interface Input {
  timestamp: firestore.Timestamp
  statId: string
}

export const createStat = (input: Input): Stat => {
  const date = input.timestamp.toDate()
  const timestampDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  )
  return {
    ...systemFields(input.statId),
    time: timestampDate.getTime(),
    timestamp: firestore.Timestamp.fromDate(timestampDate),
    postCount: 1
  }
}
