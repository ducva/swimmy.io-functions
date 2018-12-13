import { firestore } from 'firebase-admin'

export interface Update {
  updatedAt: firestore.Timestamp
}
